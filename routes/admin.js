const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const OrderServices = require('../services/order_services');

// import in the User model
const { User } = require('../models');

const {
    createAccountForm,
    createSearchForm,
    bootstrapField
} = require('../forms');

// import DAL
const { 
    getUserByEmail,
    getAdminMgrUserType
} = require('../dal/users');

// import middleware
const { 
    checkIfAuthenticatedAsAdmin,
    checkIfAuthenticatedAsAdminOrMgr
} = require('../middlewares');

// encrypt password
const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

router.get('/orders', checkIfAuthenticatedAsAdminOrMgr, async (req, res) => {
    const orderService = new OrderServices();
    const orderStatus = await orderService.getOrderStatusList();
    const orders = await orderService.getAllOrders();

    let allStatus = orderStatus.map(function(os) {
        return [os.get('id'), os.get('status')];
    })
    allStatus.unshift([0, '--Select order status--']);
    const searchForm = createSearchForm(allStatus);

    res.render('admin/orders', {
        'orderStatus': orderStatus.toJSON(),
        'orders': orders.toJSON(),
        'form': searchForm.toHTML(bootstrapField)
    });
});

router.post('/orders', async (req, res) => {
    const orderService = new OrderServices();
    const orderStatus = await orderService.getOrderStatusList();

    let allStatus = orderStatus.map(function(os) {
        return [os.get('id'), os.get('status')];
    });
    allStatus.unshift([0, '--Select order status--']);
    const searchForm = createSearchForm(allStatus);

    let q = await orderService.getAllOrders();
    searchForm.handle(req, {
        'success': async (form) => {
            if (form.data.order_status && form.data.order_status != "0") {
                q.where('status_id', '=', form.data.order_status);
            }

            if (form.data.delivery_date) {
                q.where('delivery_date', '=', form.data.delivery_date);
            }

            if (form.data.search_term) {
                q.query('join', 'users', 'orders.user_id', 'users.id')
                .where((qb) => {
                    qb.where('first_name', 'like', '%' + form.data.search_term + '%')
                    .orWhere('last_name', 'like', '%' + form.data.search_term + '%')
                    .orWhere('email', 'like', '%' + form.data.search_term + '%')
                });
            }

            let orders = await q.orderBy('delivery_date', 'asc')
            .fetch({
                'withRelated': [
                    'user',
                    'orderstatus', 
                    'orderitems', 
                    'orderitems.product', 
                    'orderitems.price'
                ]
            });

            res.render('admin/orders', {
                'orderStatus': orderStatus.toJSON(),
                'orders': orders.toJSON(),
                'form': searchForm.toHTML(bootstrapField)
            });
        },
        'error': async (form) => {
            const orderService = new OrderServices();
            const orderStatus = await orderService.getOrderStatusList();
            const orders = await orderService.getAllOrders();

            res.render('admin/orders', {
                'orderStatus': orderStatus.toJSON(),
                'orders': orders.toJSON(),
                'form': form.toHTML(bootstrapField)
            });
        },
        'empty': async (form) => {
            const orderService = new OrderServices();
            const orderStatus = await orderService.getOrderStatusList();
            const orders = await orderService.getAllOrders();

            res.render('admin/orders', {
                'orderStatus': orderStatus.toJSON(),
                'orders': orders.toJSON(),
                'form': form.toHTML(bootstrapField)
            });
        }
    });
});

router.post('/orders/:order_id/update', async (req, res) => {
    let id = req.params.order_id;
    let statusId = req.body.status_id;

    const orderService = new OrderServices();
    const order = await orderService.updateOrderStatus(id, statusId);

    if (order) {
        req.flash('success_messages', "Order " + id + " has been successfully updated.");
    } else {
        req.flash('error_messages', "Update failed.");
    }
    
    res.redirect('/admin/orders');
});

router.get('/orders/:order_id/delete', checkIfAuthenticatedAsAdminOrMgr, async (req, res) => {
    let id = req.params.order_id;

    const orderService = new OrderServices();
    let success = await orderService.deleteOrder(id);

    if (success) {
        req.flash('success_messages', "Order " + id + " has been successfully deleted.");
    } else {
        req.flash('error_messages', "Deletion failed.");
    }

    res.redirect('/admin/orders');
});

router.get('/accounts', checkIfAuthenticatedAsAdmin, async (req, res) => {
    const userType = await getAdminMgrUserType();
    const accountForm = createAccountForm(userType);

    res.render('admin/accounts', {
        'form': accountForm.toHTML(bootstrapField)
    });
});

router.post('/accounts', async (req, res) => {
    const userType = await getAdminMgrUserType();
    const accountForm = createAccountForm(userType);

    accountForm.handle(req, {
        'success': async (form) => {
            // check for account with existing email
            let existingUser = await getUserByEmail(form.data.email);
            if (existingUser) {
                req.flash("error_messages", "Account is an existing user.");
                res.redirect('/admin/accounts');
            } else {
                const user = new User({
                    'first_name': form.data.first_name,
                    'last_name': form.data.last_name,
                    'email': form.data.email,
                    'contact': form.data.contact,
                    'password': getHashedPassword(form.data.password),
                    'created_on': new Date(),
                    'user_type_id': form.data.user_type_id
                });
                await user.save();
                req.flash("success_messages", "Account created successfully.");
                res.redirect('/admin/accounts');
            }
        },
        'error': (form) => {
            res.render('admin/accounts', {
                'form': form.toHTML(bootstrapField)
            });
        }
    });
});

module.exports = router;
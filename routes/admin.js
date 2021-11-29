const express = require('express');
const router = express.Router();
const OrderServices = require('../services/order_services');

// import in the User model
const { User } = require('../models');

const {
    createAccountForm,
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


router.get('/orders', checkIfAuthenticatedAsAdminOrMgr, async (req, res) => {
    const orderService = new OrderServices();
    const orderStatus = await orderService.getOrderStatusList();
    const orders = await orderService.getAllOrders();

    res.render('admin/orders', {
        'orderStatus': orderStatus.toJSON(),
        'orders': orders.toJSON()
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
                console.log("User exists.");
                req.flash("error_messages", "Account is an existing user.");
                res.redirect('/admin/accounts');
            } else {
                const user = new User({
                    'first_name': form.data.first_name,
                    'last_name': form.data.last_name,
                    'email': form.data.email,
                    'contact': form.data.contact,
                    'password': form.data.password,
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
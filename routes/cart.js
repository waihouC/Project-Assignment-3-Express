const express = require('express');
const router = express.Router();
const CartServices = require('../services/cart_services');

// import DAL
const {
    getProductById,
    getPriceByProductandSize,
    getPriceById
} = require('../dal/products');

// import middleware
const { checkIfAuthenticated } = require('../middlewares');

function returnSize(size) {
    if (size == "R") {
        return "Regular";
    } else if (size == "L") {
        return "Large";
    }

    return "";
}

router.get('/', checkIfAuthenticated, async (req, res) => {
    let cartItems;

    const cart = new CartServices(req.session.user.id);
    cartItems = await cart.getCart();
    
    res.render('cart/index', {
        'shoppingCart': cartItems ? cartItems.toJSON() : []
    });
});

router.get('/:product_id/:size/add', checkIfAuthenticated, async (req, res) => {
    const id = req.params.product_id;
    const size = req.params.size;
    const quantity = parseInt(req.query.quantity);
    let cartItem;
    let name;
    
    if (req.session.user) {
        const cart = new CartServices(req.session.user.id);

        const price = await getPriceByProductandSize(id, size);
        cartItem = await cart.addToCart(id, price.get('id'), quantity);

        if (cartItem.related('product').get('name')) {
            name = cartItem.related('product').get('name');  // existing cart item
        } else {
            const product = await getProductById(id); // new cart item
            name = product.get('name');
        }
    }

    if (cartItem) {
        req.flash("success_messages", name + " (" + returnSize(size) + ") has been added to your cart.");
    } else {
        res.flash('error_messages', "Error encountered.");
    }

    res.redirect('/products/' + id + '/details');
});

router.get('/:product_id/:price_id/remove', checkIfAuthenticated, async (req, res) => {
    const productId = req.params.product_id;
    const priceId = req.params.price_id;
    let removed = false;
    
    if (req.session.user) {
        const cart = new CartServices(req.session.user.id);
        removed = await cart.removeFromCart(productId, priceId);
    }

    const product = await getProductById(productId);
    const price = await getPriceById(priceId);

    if (removed) {
        req.flash('success_messages', product.get('name') + " (" + returnSize(price.get('size')) + ") has been removed from your cart.");
    } else {
        req.flash("error_messages", product.get('name') + " (" + returnSize(price.get('size')) + ") does not exist in your cart.");
    }

    res.redirect('/cart');
});

router.post('/:product_id/:price_id/update', async function(req, res) {
    const newQuantity = req.body.quantity;
    const productId = req.params.product_id;
    const priceId = req.params.price_id;
    let cartItem;

    if (req.session.user) {
        const cart = new CartServices(req.session.user.id);
        cartItem = await cart.updateQuantity(productId, priceId, newQuantity);
    }
    
    if (cartItem) {
        var name = cartItem.related('product').get('name');
        var size = cartItem.related('price').get('size');
        req.flash("success_messages", name + " (" + returnSize(size) + ") has been updated.");
        res.redirect('/cart');
    } else {
        res.flash('error_messages', "Error encountered.");
        res.redirect('/cart');
    }
});

module.exports = router;
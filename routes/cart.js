const express = require('express');
const router = express.Router();
const CartServices = require('../services/cart_services');
const {
    getProductById,
    getPriceByProductandSize,
    getPriceById
} = require('../dal/products');

function returnSize(size) {
    if (size == "R") {
        return "Regular";
    } else if (size == "L") {
        return "Large";
    }

    return "";
}

router.get('/', async (req, res) => {
    let cartItems;

    if (req.session.user) {
        const cart = new CartServices(req.session.user.id);
        cartItems = await cart.getCart();
    }
    
    res.render('cart/index', {
        'shoppingCart': cartItems ? cartItems.toJSON() : []
    });
});

router.get('/:product_id/:size/add', async (req, res) => {
    const cart = new CartServices(req.session.user.id);

    var id = req.params.product_id;
    var size = req.params.size;
    var quantity = parseInt(req.query.quantity);

    const price = await getPriceByProductandSize(id, size);
    const cartItem = await cart.addToCart(id, price.get('id'), quantity);

    let name;
    if (cartItem.toJSON().product) {
        name = cartItem.toJSON().product.name;  // existing cart item
    } else {
        const product = await getProductById(id); // new cart item
        name = product.get('name');
    }

    if (cartItem) {
        req.flash("success_messages", name + " (" + returnSize(size) + ") has been added to your cart.");
    } else {
        res.flash('error_messages', "Error encountered.");
    }

    res.redirect('/products/' + id + '/details');
});

router.get('/:product_id/:price_id/remove', async (req, res) => {
    const cart = new CartServices(req.session.user.id);

    var productId = req.params.product_id;
    var priceId = req.params.price_id;
    
    const product = await getProductById(productId);
    const price = await getPriceById(priceId);
    const removed = await cart.removeFromCart(productId, priceId);

    if (removed) {
        req.flash('success_messages', product.get('name') + " (" + returnSize(price.get('size')) + ") has been removed from your cart.");
    } else {
        req.flash("error_messages", product.get('name') + " (" + returnSize(price.get('size')) + ") does not exist in your cart.");
    }

    res.redirect('/cart');
});

router.post('/:product_id/:price_id/update', async function(req, res) {
    const newQuantity = req.body.quantity;
    const cart = new CartServices(req.session.user.id);

    var productId = req.params.product_id;
    var priceId = req.params.price_id;

    let cartItem = await cart.updateQuantity(productId, priceId, newQuantity);
    var name = cartItem.toJSON().product.name;
    var size = cartItem.toJSON().price.size;
    
    if (cartItem) {
        req.flash("success_messages", name + " (" + returnSize(size) + ") has been updated.");
        res.redirect('/cart');
    } else {
        res.flash('error_messages', "Error encountered.");
        res.redirect('/cart');
    }
});

module.exports = router;
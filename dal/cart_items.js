const { CartItem } = require('../models');

const getCartItems = async (userId) => {
    return await CartItem.collection()
        .where({
            'user_id' : userId
        }).fetch({
            require: false,
            withRelated: ['user', 'product', 'price']
        });
};

const getCartItemByUserAndProductAndPrice = async (userId, productId, priceId) => {
    return await CartItem.where({
        'user_id' : userId,
        'product_id' : productId,
        'price_id': priceId
    }).fetch({
        require: false,
        withRelated: ['user', 'product', 'price']
    });
};

const createCartItem = async (userId, productId, priceId, quantity) => {
    let cartItem = new CartItem({
        'user_id': userId,
        'product_id': productId,
        'price_id': priceId,
        'quantity': quantity
    });

    await cartItem.save();
    return cartItem;
};

const removeCartItem = async (userId, productId, priceId) => {
    let cartItem = await getCartItemByUserAndProductAndPrice(userId, productId, priceId);

    if (cartItem) {
        await cartItem.destroy();
        return true;
    }
    
    return false;
}

const updateQuantity = async (userId, productId, priceId, quantity) => {
    let cartItem = await getCartItemByUserAndProductAndPrice(userId, productId, priceId);

    if (cartItem) {
        cartItem.set('quantity', quantity);
        cartItem.save();
        return cartItem;
    }

    return null;
}

module.exports = {
    getCartItems,
    getCartItemByUserAndProductAndPrice,
    createCartItem,
    removeCartItem,
    updateQuantity
};
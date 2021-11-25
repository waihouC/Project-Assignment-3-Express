const cartDataLayer = require('../dal/cart_items');

class CartServices {
    constructor(user_id) {
        this.user_id = user_id;
    }

    async getCart() {
        return await cartDataLayer.getCartItems(this.user_id);
    }

    async addToCart(productId, priceId, noOfNewItems) {
        let cartItem = await cartDataLayer.getCartItemByUserAndProductAndPrice(this.user_id, productId, priceId);
        
        if (cartItem) {
            cartItem = await cartDataLayer.updateQuantity(this.user_id, productId, priceId, cartItem.get('quantity') + noOfNewItems);
            return cartItem;
        } else {
            let newCartItem = await cartDataLayer.createCartItem(this.user_id, productId, priceId, noOfNewItems);
            return newCartItem;
        }
    }

    async removeFromCart(productId, priceId) {
        return await cartDataLayer.removeCartItem(this.user_id, productId, priceId);
    }

    async updateQuantity(productId, priceId, quantity) {
        return await cartDataLayer.updateQuantity(this.user_id, productId, priceId, quantity);
    }
}

module.exports = CartServices;
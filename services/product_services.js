const productDataLayer = require('../dal/products');

class ProductServices {
    async searchProducts(query, categoryId, size) {
        return await productDataLayer.getProductsByCategoryAndSize(query, categoryId, size);
    }

    async getProductById(productId) {
        return await productDataLayer.getProductById(productId);
    }

    async deleteProduct(product) {
        await product.destroy();
    }
}

module.exports = ProductServices;
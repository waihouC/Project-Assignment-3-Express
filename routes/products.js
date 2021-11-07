const express = require("express");
const router = express.Router();

// import in the models
const {
    Product,
    Category,
    Price
} = require('../models');

router.get('/all-products', async (req, res) => {
    let products = await Product.collection().fetch();
    res.render('products/index', {
        'page': "All Products",
        'products': products.toJSON()
    });
});

module.exports = router;
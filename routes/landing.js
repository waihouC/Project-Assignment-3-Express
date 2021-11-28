const express = require("express");
const router = express.Router();

// import in the Product model
const { Product } = require('../models');

router.get('/', async (req, res) => {
    // retrieve top 3 latest products
    const products = await Product
        .query(function(qb) {
            qb.orderBy('created_on', 'DESC');
            qb.limit(3);
        })
        .fetchAll();

    res.render('landing/index', {
        'products': products.toJSON()
    });
});

router.get('/about-us', (req, res) => {
    res.render('landing/about');
});

module.exports = router;
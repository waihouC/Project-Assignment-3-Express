const express = require("express");
const router = express.Router();

// import moment js
let moment = require("moment");

// import in the Product model
const { Product } = require('../models');

router.get('/', async (req, res) => {
    // retrieve top 3 latest products created within 2 months
    const products = await Product
        .where('created_on', '>=', moment().subtract(2, 'months').format())
        .query(function(qb) {
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
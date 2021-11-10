const express = require("express");
const router = express.Router();

// import in the models
const {
    Product,
    Category,
    Price
} = require('../models');

// filter for regular size
router.get('/all-products', async (req, res) => {
    let products = await Product.collection()
        .fetch({
            'require': true,
            'withRelated': ['category',
            {
                'prices': function(qb) {
                    qb.where('size', 'R')
                }
            }]
        });

    res.render('products/index', {
        'page': "All Products",
        'products': products.toJSON()
    });
});

// standard products
router.get('/standard', async (req, res) => {
    let products = await Product.collection()
        .where({
            'category_id': 1
        })
        .fetch({
            'require': true,
            'withRelated': ['category', 
            {
                'prices': function(qb) {
                    qb.where('size', 'R')
                }
            }]
        });

    res.render('products/index', {
        'page': "Standard",
        'products': products.toJSON()
    });
});

// premium products
router.get('/premium', async (req, res) => {
    let products = await Product.collection()
        .where({
            'category_id': 2
        })
        .fetch({
            'require': true,
            'withRelated': ['category', 
            {
                'prices': function(qb) {
                    qb.where('size', 'R')
                }
            }]
        });

    res.render('products/index', {
        'page': "Premium",
        'products': products.toJSON()
    });
});

// healthy products
router.get('/healthy', async (req, res) => {
    let products = await Product.collection()
        .where({
            'category_id': 3
        })
        .fetch({
            'require': true,
            'withRelated': ['category', 
            {
                'prices': function(qb) {
                    qb.where('size', 'R')
                }
            }]
        });

    res.render('products/index', {
        'page': "Healthy",
        'products': products.toJSON()
    });
});

// product details page
router.get('/:product_id/details', async (req, res) => {
    let product = await Product.where({
        'id': req.params.product_id
    })
    .fetch({
        'require': true,
        'withRelated': ['category', 'prices']
    });
    
    res.render('products/details', {
        'product': product.toJSON()
    });
});

module.exports = router;
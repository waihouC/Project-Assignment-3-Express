const express = require("express");
const router = express.Router();

// import in the Product model
const { Product } = require('../models');

router.get('/', (req, res) => {
    res.render('landing/index')
})

router.get('/about-us', (req, res) => {
    res.render('landing/about')
})

module.exports = router;
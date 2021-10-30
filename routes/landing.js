const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('landing/index')
})

router.get('/about-us', (req, res) => {
    res.render('landing/about')
})

module.exports = router;
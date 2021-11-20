const express = require('express');
const cloudinary = require('cloudinary');
const router = express.Router();

router.get('/sign', function(req, res) {
    const params_to_sign = JSON.parse(req.query.params_to_sign);
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // get the signature
    const signature = cloudinary.utils.api_sign_request(params_to_sign, apiSecret);
    
    res.send(signature);
});

module.exports = router;
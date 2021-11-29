const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CartServices = require('../services/cart_services');
const StripeServices = require('../services/stripe_services');
const OrderServices = require('../services/order_services');

// import middleware
const { checkIfAuthenticated } = require('../middlewares');

function returnSize(size) {
    if (size == "R") {
        return "Regular";
    } else if (size == "L") {
        return "Large";
    }

    return "";
}

router.get('/', checkIfAuthenticated, async (req, res) => {
    let lineItems = [];
    let meta = [];

    const stripe = new StripeServices();

    // create tax rate
    const taxRate = await stripe.createTaxRate();
    
    const cart = new CartServices(req.session.user.id);
    let items = await cart.getCart();
    
    // create line items
    for (let item of items) {
        const size = returnSize(item.related('price').get('size'));
        const lineItem = {
            'name': item.related('product').get('name') + " (" + size + ")",
            'amount': item.related('price').get('cost'),
            'quantity': item.get('quantity'),
            'currency': 'SGD',
            'tax_rates': [taxRate.id]
        }

        if (item.related('product').get('image_url')) {
            lineItem['images'] = [item.related('product').get('image_url')];
        }

        lineItems.push(lineItem);
        
        meta.push({
            'product_id': item.get('product_id'),
            'price_id': item.get('price_id'),
            'quantity': item.get('quantity')
        });
    }

    // create stripe payment
    let metaData = JSON.stringify(meta);
    const payment = {
        'payment_method_types': ['card'],
        'line_items': lineItems,
        'success_url': process.env.STRIPE_SUCCESS_URL,
        'cancel_url': process.env.STRIPE_CANCEL_URL,
        'customer_email': req.session.user.email,
        'shipping_address_collection': { 
            'allowed_countries': ['SG']
        },
        'shipping_options': [
            {
                'shipping_rate_data': {
                    'display_name': 'Shipping',
                    'type': 'fixed_amount',
                    'fixed_amount': {
                        'amount': 1000,
                        'currency': 'SGD'
                    },
                    'delivery_estimate': {
                        'maximum': {
                            unit: 'business_day',
                            value: 5
                        },
                        'minimum': {
                            unit: 'business_day',
                            value: 3
                        }
                    }
                }
            }
        ],
        'metadata': {
            'orders': metaData,
            'user_id': req.session.user.id
        }
    }

    // register payment session
    let stripeSession = await stripe.createPaymentSession(payment);
    res.render('checkout/index', {
        'sessionId': stripeSession.id,
        'publishableKey': process.env.STRIPE_PUBLISHABLE_KEY
    });
});

router.get('/success', async (req, res) => {
    const sessionId = req.query.sessionId;

    const stripe = new StripeServices();
    
    // get line items from session
    const orderItems = await stripe.returnLineItems(sessionId);

    // get shipping amount and total from session
    const session = await stripe.retrievePaymentSession(sessionId);
    
    res.render('checkout/success', {
        'orderItems': orderItems.data,
        'session': session
    });
});

router.get('/cancelled', (req, res) => {
    res.render('checkout/cancelled');
});

router.post('/process_payment', bodyParser.raw({type: 'application/json'}), async (req, res) => {
    let payload = req.body;
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let sigHeader = req.headers["stripe-signature"];
    let event;

    try {
        const stripe = new StripeServices();
        event = stripe.createWebhook(payload, sigHeader, endpointSecret);
    } catch (e) {
        // invalid request
        res.send({
            'error': e.message
        });
        console.log(e.message);
    }

    // payment successful
    if (event.type == 'checkout.session.completed') {
        let stripeSession = event.data.object;

        // create new order
        const orderService = new OrderServices();
        let created = await orderService.createNewOrder(stripeSession);

        // remove items from cart
        if (created) {
            const orderItems = JSON.parse(stripeSession.metadata.orders);
            const cart = new CartServices(parseInt(stripeSession.metadata.user_id));
            for (let item of orderItems) {
                await cart.removeFromCart(item.product_id, item.price_id);
            }
        }
    }

    res.send({ 'received': true });
});

module.exports = router;
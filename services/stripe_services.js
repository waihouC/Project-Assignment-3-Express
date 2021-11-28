const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class StripeServices {
    async createTaxRate() {
        return await Stripe.taxRates.create({
            display_name: 'GST',
            inclusive: true,
            percentage: 7,
            country: 'SG'
        });
    }

    async createPaymentSession(payment) {
        return await Stripe.checkout.sessions.create(payment);
    }

    async retrievePaymentSession(sessionId) {
        return await Stripe.checkout.sessions.retrieve(sessionId);
    }
    
    returnLineItems(sessionId) {
        return new Promise((resolve, reject) => {
            Stripe.checkout.sessions.listLineItems(sessionId, {limit: 100}, (err, listItems) => {
                if(err) {
                    return reject(err);
                }
    
                resolve(listItems);
            });
        });
    }

    createWebhook(payload, sigHeader, endpointSecret) {
        return Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);
    }
}

module.exports = StripeServices;
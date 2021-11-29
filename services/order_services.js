// import moment js
let moment = require("moment");

const orderDataLayer = require('../dal/orders');

class OrderServices {
    async getOrderStatusList() {
        return await orderDataLayer.getAllOrderStatus();
    }

    async getAllOrders() {
        return await orderDataLayer.getAllOrders();
    }

    // create new order and its items after successful payment
    async createNewOrder(session) {
        let status_id = (session.payment_status.toLowerCase() === 'paid') ? 
            await orderDataLayer.getOrderStatusId('Paid') : await orderDataLayer.getOrderStatusId('Pending');

        let userId = parseInt(session.metadata.user_id);

        let address;
        if (session.shipping.address.line2) {
            address = session.shipping.address.line1.trim() + " " + session.shipping.address.line2.trim();
        } else {
            address = session.shipping.address.line1.trim();
        }

        // max delivery date
        let delivery_date = moment().add(5, 'd').format('YYYY-MM-DD')

        let order = await orderDataLayer.createOrder(
            session.amount_total,
            new Date(),
            delivery_date,
            address,
            session.shipping.address.postal_code,
            userId,
            status_id
        );

        // create order items
        if (order) {
            const orderItems = JSON.parse(session.metadata.orders);
            
            for (let item of orderItems) {
                await orderDataLayer.createOrderItem(
                    item.quantity,
                    order.get('id'),
                    item.product_id,
                    item.price_id
                );
            }

            return true;
        } else {
            console.log("Error creating order");
            return false;
        }
    }

    async updateOrderStatus(orderId, statusId) {
        return await orderDataLayer.updateStatusId(orderId, statusId);
    }

    async deleteOrder(orderId) {
        return await orderDataLayer.deleteOrderById(orderId);
    }
}

module.exports = OrderServices;
const {
    Order,
    OrderStatus,
    OrderItem
} = require('../models');

const getOrderStatusId = async (status) => {
    let orderStatus = OrderStatus.where({
        'status': status
    }).fetch({
        'require': true
    });

    return orderStatus.get('id');
};

const getAllOrderStatus = async () => {
    // need to be in JSON object to populate dropdown
    return await OrderStatus.fetchAll();
};

const getAllOrders = async () => {
    return await Order.collection()
    .orderBy('delivery_date', 'asc')
    .fetch({
        'require': false,
        'withRelated': [
            'user', 
            'orderstatus', 
            'orderitems', 
            'orderitems.product', 
            'orderitems.price'
        ]
    });
};

const getOrderById = async (id) => {
    return await Order.where({
        'id': id
    }).fetch({
        'require': false,
        'withRelated': [
            'user', 
            'orderstatus', 
            'orderitems'
        ]
    });
};

const createOrder = async (totalAmt, orderDate, deliveryDate, address, postalCode, userId, statusId) => {
    let newOrder = new Order({
        'total_amt': totalAmt,
        'order_date': orderDate,
        'delivery_date': deliveryDate,
        'address': address,
        'postal_code': postalCode,
        'user_id': userId,
        'status_id': statusId
    });

    let order = await newOrder.save();
    return order;
};

const createOrderItem = async (quantity, orderId, productId, priceId) => {
    let newOrderItem = new OrderItem({
        'quantity': quantity,
        'order_id': orderId,
        'product_id': productId,
        'price_id': priceId
    });

    let orderItem = await newOrderItem.save();
    return orderItem;
}

const updateStatusId = async (orderId, statusId) => {
    let order = await getOrderById(orderId);

    if (order) {
        order.set('status_id', statusId);
        await order.save();
        return order;
    }

    return null;
};

const deleteOrderById = async (orderId) => {
    let order = await getOrderById(orderId);

    if (order) {
        await order.destroy();
        return true;
    }

    return false;
};

module.exports = {
    getOrderStatusId,
    getAllOrderStatus,
    getAllOrders,
    getOrderById,
    createOrder,
    createOrderItem,
    updateStatusId,
    deleteOrderById
};
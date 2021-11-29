const bookshelf = require('../bookshelf');

const User = bookshelf.model('User', {
    'tableName': 'users',
    usertype() {
        return this.belongsTo('UserType');
    }
});

const UserType = bookshelf.model('UserType', {
    'tableName': 'user_type',
    users() {
        return this.hasMany('User');
    }
});

const Category = bookshelf.model('Category',{
    tableName: 'categories',
    products() {
        return this.hasMany('Product');
    }
});

const Product = bookshelf.model('Product', {
    tableName: 'products',
    category() {
        return this.belongsTo('Category');
    },
    prices() {
        return this.hasMany('Price');
    },
    tags() {
        return this.belongsToMany('Tag');
    }
});

const Price = bookshelf.model('Price', {
    tableName: 'prices',
    product() {
        return this.belongsTo('Product');
    }
});

const Tag = bookshelf.model('Tag', {
    tableName: 'tags',
    products() {
        return this.belongsToMany('Product');
    }
});

const CartItem = bookshelf.model('CartItem', {
    tableName: 'cart_items',
    product() {
        return this.belongsTo('Product');
    },
    price() {
        return this.belongsTo('Price');
    },
    user() {
        return this.belongsTo('User');
    }
});

const OrderStatus = bookshelf.model('OrderStatus', {
    tableName: 'order_status',
    orders() {
        return this.hasMany('Order');
    }
});

const Order = bookshelf.model('Order', {
    tableName: 'orders',
    user() {
        return this.belongsTo('User');
    },
    orderstatus() {
        return this.belongsTo('OrderStatus');
    },
    orderitems() {
        return this.hasMany('OrderItem');
    }
});

const OrderItem = bookshelf.model('OrderItem', {
    tableName: 'order_items',
    order() {
        return this.belongsTo('Order');
    },
    product() {
        return this.belongsTo('Product');
    },
    price() {
        return this.belongsTo('Price');
    }
});

module.exports = { 
    User,
    UserType,
    Category,
    Product,
    Price,
    Tag,
    CartItem,
    OrderStatus,
    Order,
    OrderItem
};
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
})

const Category = bookshelf.model('Category',{
    tableName: 'categories',
    products() {
        return this.hasMany('Product');
    }
})

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
})

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
})

module.exports = { 
    User,
    UserType,
    Category,
    Product,
    Price,
    Tag,
    CartItem
};
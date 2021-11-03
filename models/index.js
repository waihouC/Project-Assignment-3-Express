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

module.exports = { 
    User,
    UserType
};
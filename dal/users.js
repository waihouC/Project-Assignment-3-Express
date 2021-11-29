// import in the User model
const { 
    User,
    UserType
} = require('../models');

async function getUserByEmail(email) {
    let user = await User.where({
        'email': email
    }).fetch({
        'require': false
    });

    return user;
}

async function getAdminMgrUserType() {
    let userType = await UserType.query(function(qb) {
        qb.where('type', 'in', ['admin', 'manager']);
    }).fetchAll().map(function(type) {
        return [type.get('id'), type.get('type').charAt(0).toUpperCase() + type.get('type').slice(1)];
    });

    return userType;
}

module.exports = {
    getUserByEmail,
    getAdminMgrUserType
};
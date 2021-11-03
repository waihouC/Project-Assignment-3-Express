// Setting up the database connection
const knex = require('knex')({
    'client': 'mysql',
    'connection': {
        'user': 'waihouC',
        'password': 'erathia5',
        'database': 'icecream'
    }
});

const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;
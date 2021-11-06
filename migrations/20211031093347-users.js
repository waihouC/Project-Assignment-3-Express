'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('users', {
    'id': {
      'type': 'int',
      'primaryKey': true,
      'autoIncrement': true,
      'unsigned': true
    },
    'first_name': {
      'type': 'string',
      'length': 50
    },
    'last_name': {
      'type': 'string',
      'length': 50
    },
    'email': {
      'type': 'string',
      'length': 255
    },
    'contact': {
      'type': 'string',
      'length': 8
    },
    'password': {
      'type': 'string',
      'length': 100
    },
    'created_on': 'datetime',
    'last_logged_in': 'datetime',
    'user_type_id': {
      'type': 'int',
      'unsigned': true,
      'notNull': true,
      'foreignKey': {
        'name': 'users_user_type_fk',
        'table': 'user_type',
        'mapping': 'id',
        'rules': {
          'onDelete': 'CASCADE'
        }
      }
    }
  });
};

exports.down = function(db) {
  return db.dropTable('users');
};

exports._meta = {
  "version": 1
};

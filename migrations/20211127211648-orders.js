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
  return db.createTable('orders', {
    'id': {
      'type': 'int',
      'primaryKey': true,
      'autoIncrement': true,
      'unsigned': true
    },
    'total_amt': 'int',
    'order_date': 'datetime',
    'delivery_date': 'date',
    'address': 'text',
    'postal_code': {
      'type': 'string',
      'length': 6
    },
    'user_id': {
      'type': 'int',
      'unsigned': true,
      'notNull': true,
      'foreignKey': {
        'name': 'order_user_fk',
        'table': 'users',
        'mapping': 'id',
        'rules': {
          'onDelete': 'CASCADE'
        }
      }
    },
    'status_id': {
      'type': 'int',
      'unsigned': true,
      'notNull': true,
      'foreignKey': {
        'name': 'order_order_status_fk',
        'table': 'order_status',
        'mapping': 'id',
        'rules': {
          'onDelete': 'CASCADE'
        }
      }
    }
  });
};

exports.down = function(db) {
  return db.dropTable('orders');
};

exports._meta = {
  "version": 1
};

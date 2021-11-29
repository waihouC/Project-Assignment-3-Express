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
  return db.createTable('order_items', {
    'id': {
      'type': 'int',
      'primaryKey': true,
      'autoIncrement': true,
      'unsigned': true
    },
    'quantity': {
      'type': 'int',
      'unsigned': true
    },
    'order_id': {
      'type': 'int',
      'notNull': true,
      'unsigned': true,
      'foreignKey': {
        'name': 'order_item_order_fk',
        'table': 'orders',
        'mapping': 'id',
        'rules': {
          'onDelete': 'CASCADE'
        }
      }
    },
    'product_id': {
      'type': 'int',
      'notNull': true,
      'unsigned': true,
      'foreignKey': {
        'name': 'order_item_product_fk',
        'table': 'products',
        'mapping': 'id',
        'rules': {
          'onDelete': 'CASCADE'
        }
      }
    },
    'price_id': {
      'type': 'int',
      'notNull': true,
      'unsigned': true,
      'foreignKey': {
        'name': 'order_item_price_fk',
        'table': 'prices',
        'mapping': 'id',
        'rules': {
          'onDelete': 'CASCADE'
        }
      }
    }
  });
};

exports.down = function(db) {
  return db.dropTable('order_items');
};

exports._meta = {
  "version": 1
};

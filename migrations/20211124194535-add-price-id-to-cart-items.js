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
  return db.addColumn('cart_items', 'price_id', {
    'type': 'int',
    'notNull': true,
    'unsigned': true,
    'foreignKey': {
      'name': 'cart_items_price_fk',
      'table': 'prices',
      'mapping': 'id',
      'rules': {
        'onDelete': 'CASCADE',
        'onUpdate': 'RESTRICT'
      }
    }
  });
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};

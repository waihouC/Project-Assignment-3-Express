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
  return db.createTable('prices', {
    'id': {
      'type': 'int',
      'primaryKey': true,
      'autoIncrement': true,
      'unsigned': true
    },
    'size': {
      'type': 'char',
      'length': 1
    },
    'cost': 'int',
    'volume': 'int',
    'product_id': {
      'type': 'int',
      'unsigned': true,
      'notNull': true,
      'foreignKey': {
        'name': 'prices_products_fk',
        'table': 'products',
        'mapping': 'id',
        'rules': {
          'onDelete': 'CASCADE'
        }
      }
    }
  });
};

exports.down = function(db) {
  return db.dropTable('prices');
};

exports._meta = {
  "version": 1
};

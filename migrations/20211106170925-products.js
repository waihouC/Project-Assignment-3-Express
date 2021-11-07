'use strict';

const { text } = require("express");

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
  return db.createTable('products', {
    'id': {
      'type': 'int',
      'primaryKey': true,
      'autoIncrement': true,
      'unsigned': true
    },
    'name': {
      'type': 'string',
      'length': 100
    },
    'description': 'text',
    'image_url': {
      'type': 'string',
      'length': 255
    },
    'created_on': 'datetime',
    'category_id': {
      'type': 'int',
      'unsigned': true,
      'notNull': true,
      'foreignKey': {
        'name': 'product_category_fk',
        'table': 'categories',
        'mapping': 'id',
        'rules': {
          'onDelete': 'CASCADE'
        }
      }
    }
  });
};

exports.down = function(db) {
  return db.dropTable('products');
};

exports._meta = {
  "version": 1
};

// import in the models
const {
    Product,
    Category,
    Price,
    Tag
} = require('../models');

// select * from products
// left join products_tags on products.id = product_id
// left join tags on tags.id = tag_id
// left join prices on products.id = product_id
// where (category_id = categoryId) and (prices.size = size) and
// (products.name like '%<queryTerm>%' or 
// tags.name in <queryTerm>)
// orderby created_on desc
const getProductsByCategoryAndSize = async (queryTerm, categoryId, size) => {
    let q = Product.collection();

    if (categoryId) {
        q.where('category_id', categoryId);
    }

    if (queryTerm) {
        q.query('join', 'products_tags', 'products.id', 'product_id')
         .query('join', 'tags', 'tags.id', 'tag_id')
         .where((qb) => {
            qb.where('products.name', 'like', '%' + queryTerm + '%')
            
            if (queryTerm.includes(",")) {
                qb.orWhere('tags.name', 'in', queryTerm.split(","))
            } else {
                qb.orWhere('tags.name', queryTerm)
            }
         });
    }
    
    let products = await q.orderBy('-created_on').fetch({
        'require': false,
        'withRelated': ['category', 'tags',
        {
            'prices': (qb) => {
                qb.where('size', size);
            }
        }]
    });
    
    return products;
}

const getProductById = async (productId) => {
    let product = await Product.where({
        'id': productId
    })
    .fetch({
        'require': true,
        'withRelated': ['category', 'tags',
        {
            'prices': function(qb) {
                qb.orderBy('volume', 'asc');
            }
        }]
    });

    return product;
}

const getAllCategories = async () => {
    let allCategories = await Category.fetchAll().map(function (category) {
        return [category.get('id'), category.get('name')];
    });

    return allCategories;
}

const getAllTags = async () => {
    let allTags = await Tag.fetchAll().map(function (tag) {
        return [tag.get('id'), tag.get('name')];
    });

    return allTags;
}

const getPriceByProductandSize = async (productId, size) => {
    let price = await Price.where({
        'product_id': productId,
        'size': size
    })
    .fetch({
        'require': false,
        'withRelated': ['product']
    });

    return price;
}

module.exports = {
    getProductsByCategoryAndSize,
    getProductById,
    getAllCategories,
    getAllTags,
    getPriceByProductandSize
};
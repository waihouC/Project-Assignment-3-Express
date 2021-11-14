const express = require("express");
const { createNewProductForm, bootstrapField } = require("../forms");
const router = express.Router();

// import in the models
const {
    Product,
    Category,
    Price
} = require('../models');

// data layer
async function getProductsByCategoryAndSize(categoryId, size) {
    let q = Product.collection();

    if (categoryId) {
        q.where('category_id', categoryId)
    }

    let products = await q.fetch({
        'require': true,
        'withRelated': ['category',
        {
            'prices': function(qb) {
                qb.where('size', size);
            }
        }]
    });
    
    return products;
}

async function getProductById(productId) {
    let product = await Product.where({
        'id': productId
    })
    .fetch({
        'require': true,
        'withRelated': ['category', 
        {
            'prices': function(qb) {
                qb.orderBy('volume', 'asc');
            }
        }]
    });

    return product;
}

async function getAllCategories() {
    let allCategories = await Category.fetchAll().map(function (category) {
        return [category.get('id'), category.get('name')]
    });

    return allCategories;
}

async function getPriceByProductandSize(productId, size) {
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


// filter for regular size
router.get('/all-products', async (req, res) => {
    let products = await getProductsByCategoryAndSize(null, 'R');

    res.render('products/index', {
        'page': "All Products",
        'products': products.toJSON()
    });
});

// standard products
router.get('/standard', async (req, res) => {
    let products = await getProductsByCategoryAndSize(1, 'R');

    res.render('products/index', {
        'page': "Standard",
        'products': products.toJSON()
    });
});

// premium products
router.get('/premium', async (req, res) => {
    let products = await getProductsByCategoryAndSize(2, 'R');

    res.render('products/index', {
        'page': "Premium",
        'products': products.toJSON()
    });
});

// healthy products
router.get('/healthy', async (req, res) => {
    let products = await getProductsByCategoryAndSize(3, 'R');

    res.render('products/index', {
        'page': "Healthy",
        'products': products.toJSON()
    });
});

// product details page
router.get('/:product_id/details', async (req, res) => {
    let product = await getProductById(req.params.product_id);

    res.render('products/details', {
        'product': product.toJSON()
    });
});

// delete product
router.post('/:product_id/details', async (req, res) => {
    let product = await getProductById(req.params.product_id);

    var name = product.name;
    await product.destroy();

    req.flash("success_messages", name + " product deleted successfully.");
    res.redirect('/products/all-products');
});

// create new product
router.get('/create', async (req, res) => {
    const allCategories = await getAllCategories();

    const productForm = createNewProductForm(allCategories);
    res.render('products/create', {
        'form': productForm.toHTML(bootstrapField)
    });
});

// submit new product
router.post('/create', async (req, res) => {
    const allCategories = await getAllCategories();

    const productForm = createNewProductForm(allCategories);

    productForm.handle(req, {
        'success': async (form) => {
            let newProduct = new Product();
            newProduct.set('name', form.data.name);
            newProduct.set('description', form.data.description);
            newProduct.set('image_url', form.data.image_url);
            newProduct.set('created_on', new Date());
            newProduct.set('category_id', form.data.category_id);

            let saved = await newProduct.save();

            // insert data for regular size
            if (form.data.cost_regular || form.data.volume_regular) {
                let regularPrice = new Price();

                regularPrice.set('size', 'R');
                regularPrice.set('cost', form.data.cost_regular);
                regularPrice.set('volume', form.data.volume_regular);
                regularPrice.set('product_id', saved.id);

                await regularPrice.save();
            }

            // insert data for large size
            if (form.data.cost_large || form.data.volume_large) {
                let largePrice = new Price();

                largePrice.set('size', 'L');
                largePrice.set('cost', form.data.cost_large);
                largePrice.set('volume', form.data.volume_large);
                largePrice.set('product_id', saved.id);

                await largePrice.save();
            }

            req.flash("success_messages", "New product created.");
            res.redirect('/products/all-products');
        },
        'error': (form) => {
            res.render('products/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    });
});

// update product
router.get('/:product_id/update', async (req, res) => {
    const allCategories = await getAllCategories();
    
    let product = await getProductById(req.params.product_id);

    let productForm = createNewProductForm(allCategories);
    productForm.fields.name.value = product.get('name');
    productForm.fields.description.value = product.get('description');
    productForm.fields.image_url.value = product.get('image_url');
    productForm.fields.category_id.value = product.get('category_id');

    let productPrices = await product.related('prices');

    if (productPrices.length > 0)
    {
        // if only 1 record, can be either regular or large
        if (productPrices.toJSON()[0].size == 'R') {
            productForm.fields.cost_regular.value = productPrices.toJSON()[0].cost;
            productForm.fields.volume_regular.value = productPrices.toJSON()[0].volume;
        } else if (productPrices.toJSON()[0].size == 'L') {
            productForm.fields.cost_large.value = productPrices.toJSON()[0].cost;
            productForm.fields.volume_large.value = productPrices.toJSON()[0].volume;
        }

        // when there are 2 records, means 2nd record is for large size
        if (productPrices.length > 1) {
            productForm.fields.cost_large.value = parseInt(productPrices.toJSON()[1].cost);
            productForm.fields.volume_large.value = parseInt(productPrices.toJSON()[1].volume);
        }
    }

    res.render('products/update', {
        'product': product.toJSON(),
        'form': productForm.toHTML(bootstrapField)
    });
});

// submit updated product
router.post('/:product_id/update', async (req, res) => {
    const allCategories = await getAllCategories();
    
    let product = await getProductById(req.params.product_id);

    const productForm = createNewProductForm(allCategories);

    productForm.handle(req, {
        'success': async (form) => {
            product.set('name', form.data.name);
            product.set('description', form.data.description);
            product.set('image_url', form.data.image_url);
            product.set('created_on', new Date());
            product.set('category_id', form.data.category_id);

            await product.save();

            let regularPrice = await getPriceByProductandSize(req.params.product_id, 'R');
            // if exist, update else insert
            if (regularPrice) {
                if (form.data.cost_regular) {
                    regularPrice.set('cost', form.data.cost_regular);
                }
                if (form.data.volume_regular) {
                    regularPrice.set('volume', form.data.volume_regular);
                }

                await regularPrice.save();
            } else {
                if (form.data.cost_regular || form.data.volume_regular) {
                    regularPrice = new Price();

                    regularPrice.set('size', 'R');
                    regularPrice.set('cost', form.data.cost_regular);
                    regularPrice.set('volume', form.data.volume_regular);
                    regularPrice.set('product_id', product.id);

                    await regularPrice.save();
                }
            }
            
            let largePrice = await getPriceByProductandSize(req.params.product_id, 'L');
            // if exist, update else insert
            if (largePrice) {
                if (form.data.cost_large) {
                    largePrice.set('cost', form.data.cost_large);
                }
                if (form.data.volume_large) {
                    largePrice.set('volume', form.data.volume_large);
                }

                await largePrice.save();
            } else {
                if (form.data.cost_large || form.data.volume_large) {
                    largePrice = new Price();
    
                    largePrice.set('size', 'L');
                    largePrice.set('cost', form.data.cost_large);
                    largePrice.set('volume', form.data.volume_large);
                    largePrice.set('product_id', product.id);
    
                    await largePrice.save();
                }
            }

            req.flash("success_messages", form.data.name + " updated successfully.");
            res.redirect('/products/all-products');
        },
        'error': (form) => {
            res.render('products/update', {
                'product': product.toJSON(),
                'form': form.toHTML(bootstrapField)
            })
        }
    });
});

module.exports = router;
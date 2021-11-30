const express = require("express");
const { createProductForm, bootstrapField } = require("../forms");
const { createSearchForm, searchBootstrapField } = require("../forms/search");
const router = express.Router();
const ProductServices = require("../services/product_services");

// import in the models
const {
    Product,
    Price
} = require('../models');

// import in the DAL
const {
    getAllCategories,
    getAllTags,
    getPriceByProductandSize
} = require('../dal/products');

// import middleware
const { checkIfAuthenticatedAsAdminOrMgr } = require('../middlewares');


// show all products with regular size info
router.get('/all-products', async (req, res) => {
    const searchForm = createSearchForm();
    
    const productService = new ProductServices();
    const products = await productService.searchProducts(null, null, 'R');

    res.render('products/index', {
        'page': "All Products",
        'products': products.toJSON(),
        'form': searchForm.toHTML(searchBootstrapField)
    });
});

// search all products
router.post('/all-products', async (req, res) => {
    const searchForm = createSearchForm();
    const productService = new ProductServices();
    
    searchForm.handle(req, {
        'success': async (form) => {
            let products = await productService.searchProducts(form.data.search_query, null, 'R');

            res.render('products/index', {
                'isSearch': true,
                'page': "All Products",
                'products': products.toJSON(),
                'form': form.toHTML(searchBootstrapField)
            });
        },
        'error': async (form) => {
            let products = await productService.searchProducts(null, null, 'R');

            res.render('products/index', {
                'isSearch': false,
                'page': "All Products",
                'products': products.toJSON(),
                'form': form.toHTML(searchBootstrapField)
            });
        },
        'empty': async (form) => {
            let products = await productService.searchProducts(null, null, 'R');

            res.render('products/index', {
                'isSearch': false,
                'page': "All Products",
                'products': products.toJSON(),
                'form': form.toHTML(searchBootstrapField)
            });
        }
    })
});

// standard products
router.get('/standard', async (req, res) => {
    const searchForm = createSearchForm();
    
    const productService = new ProductServices();
    const products = await productService.searchProducts(null, 1, 'R');

    res.render('products/index', {
        'page': "Standard",
        'products': products.toJSON(),
        'form': searchForm.toHTML(searchBootstrapField)
    });
});

// search standard products
router.post('/standard', async (req, res) => {
    const searchForm = createSearchForm();
    const productService = new ProductServices();
    
    searchForm.handle(req, {
        'success': async (form) => {
            let products = await productService.searchProducts(form.data.search_query, 1, 'R');

            res.render('products/index', {
                'isSearch': true,
                'page': "Standard",
                'products': products.toJSON(),
                'form': form.toHTML(searchBootstrapField)
            });
        },
        'error': async (form) => {
            let products = await productService.searchProducts(null, 1, 'R');

            res.render('products/index', {
                'isSearch': false,
                'page': "Standard",
                'products': products.toJSON(),
                'form': form.toHTML(searchBootstrapField)
            });
        },
        'empty': async (form) => {
            let products = await productService.searchProducts(null, 1, 'R');

            res.render('products/index', {
                'isSearch': false,
                'page': "Standard",
                'products': products.toJSON(),
                'form': form.toHTML(searchBootstrapField)
            });
        }
    })
});

// premium products
router.get('/premium', async (req, res) => {
    const searchForm = createSearchForm();
    
    const productService = new ProductServices();
    const products = await productService.searchProducts(null, 2, 'R');

    res.render('products/index', {
        'page': "Premium",
        'products': products.toJSON(),
        'form': searchForm.toHTML(searchBootstrapField)
    });
});

// search premium products
router.post('/premium', async (req, res) => {
    const searchForm = createSearchForm();
    const productService = new ProductServices();
    
    searchForm.handle(req, {
        'success': async (form) => {
            let products = await productService.searchProducts(form.data.search_query, 2, 'R');

            res.render('products/index', {
                'isSearch': true,
                'page': "Premium",
                'products': products.toJSON(),
                'form': form.toHTML(searchBootstrapField)
            });
        },
        'error': async (form) => {
            let products = await productService.searchProducts(null, 2, 'R');

            res.render('products/index', {
                'isSearch': false,
                'page': "Premium",
                'products': products.toJSON(),
                'form': form.toHTML(searchBootstrapField)
            });
        },
        'empty': async (form) => {
            let products = await productService.searchProducts(null, 2, 'R');

            res.render('products/index', {
                'isSearch': false,
                'page': "Premium",
                'products': products.toJSON(),
                'form': form.toHTML(searchBootstrapField)
            });
        }
    })
});

// healthy products
router.get('/healthy', async (req, res) => {
    const searchForm = createSearchForm();
    
    const productService = new ProductServices();
    const products = await productService.searchProducts(null, 3, 'R');

    res.render('products/index', {
        'page': "Healthy",
        'products': products.toJSON(),
        'form': searchForm.toHTML(searchBootstrapField)
    });
});

// search healthy products
router.post('/healthy', async (req, res) => {
    const searchForm = createSearchForm();
    const productService = new ProductServices();
    
    searchForm.handle(req, {
        'success': async (form) => {
            let products = await productService.searchProducts(form.data.search_query, 3, 'R');

            res.render('products/index', {
                'isSearch': true,
                'page': "Healthy",
                'products': products.toJSON(),
                'form': form.toHTML(searchBootstrapField)
            });
        },
        'error': async (form) => {
            let products = await productService.searchProducts(null, 3, 'R');

            res.render('products/index', {
                'isSearch': false,
                'page': "Healthy",
                'products': products.toJSON(),
                'form': form.toHTML(searchBootstrapField)
            });
        },
        'empty': async (form) => {
            let products = await productService.searchProducts(null, 3, 'R');

            res.render('products/index', {
                'isSearch': false,
                'page': "Healthy",
                'products': products.toJSON(),
                'form': form.toHTML(searchBootstrapField)
            });
        }
    })
});

// product details page
router.get('/:product_id/details', async (req, res) => {
    const productService = new ProductServices();
    let product = await productService.getProductById(req.params.product_id);

    res.render('products/details', {
        'product': product.toJSON()
    });
});

// delete product
router.post('/:product_id/details', async (req, res) => {
    const productService = new ProductServices();
    let product = await productService.getProductById(req.params.product_id);
    // store name before destroying
    var name = product.get('name');
    await productService.deleteProduct(product);

    req.flash("success_messages", name + " product deleted successfully.");
    res.redirect('/products/all-products');
});

// create new product
router.get('/create', checkIfAuthenticatedAsAdminOrMgr, async (req, res) => {
    const allCategories = await getAllCategories();
    const allTags = await getAllTags();

    const productForm = createProductForm(allCategories, allTags);
    res.render('products/create', {
        'form': productForm.toHTML(bootstrapField),
        'cloudinaryName': process.env.CLOUDINARY_NAME,
        'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
        'cloudinaryPreset': process.env.CLOUDINARY_UPLOAD_PRESET
    });
});

// submit new product
router.post('/create', async (req, res) => {
    const allCategories = await getAllCategories();
    const allTags = await getAllTags();

    const productForm = createProductForm(allCategories, allTags);

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

            if (form.data.tags) {
                await newProduct.tags().attach(form.data.tags.split(","));
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
router.get('/:product_id/update', checkIfAuthenticatedAsAdminOrMgr, async (req, res) => {
    const allCategories = await getAllCategories();
    const allTags = await getAllTags();
    
    const productService = new ProductServices();
    let product = await productService.getProductById(req.params.product_id);

    let productForm = createProductForm(allCategories, allTags);
    productForm.fields.name.value = product.get('name');
    productForm.fields.description.value = product.get('description');
    productForm.fields.image_url.value = product.get('image_url');
    productForm.fields.category_id.value = product.get('category_id');

    let selectedTags = await product.related('tags').pluck('id');
    productForm.fields.tags.value= selectedTags;
    
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
        'form': productForm.toHTML(bootstrapField),
        'cloudinaryName': process.env.CLOUDINARY_NAME,
        'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
        'cloudinaryPreset': process.env.CLOUDINARY_UPLOAD_PRESET
    });
});

// submit updated product
router.post('/:product_id/update', async (req, res) => {
    const allCategories = await getAllCategories();
    const allTags = await getAllTags();
    
    const productService = new ProductServices();
    let product = await productService.getProductById(req.params.product_id);

    const productForm = createProductForm(allCategories, allTags);

    productForm.handle(req, {
        'success': async (form) => {
            product.set('name', form.data.name);
            product.set('description', form.data.description);
            product.set('image_url', form.data.image_url);
            product.set('category_id', form.data.category_id);

            await product.save();

            let tagIds = form.data.tags.split(',');
            // original selected tags
            let existingTagIds = await product.related('tags').pluck('id');

            // remove unselected tags
            let toRemove = existingTagIds.filter(function(id) {
                return tagIds.includes(id) === false;
            });
            await product.tags().detach(toRemove);

            // add in all tags selected
            await product.tags().attach(tagIds);

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
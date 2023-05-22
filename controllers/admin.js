// const { Product } = require('./../models');
const Product = require('./../models/product')
const helpers = require('./../utils/helpers')

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
    .then(products => {
        res.render('admin/products', {
            path: "/admin/products",
            products: products,
            pageTitle: "Admin - All product"
        })
    })
    .catch(err => {
        helpers.errorHandle(err)
    })
}

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        path: "/admin/add-product",
        pageTitle: "Add product"
    })
}

exports.postAddProduct = async (req, res, next) => {
    const { title, description, imageUrl, price } = req.body;
    const product = new Product(title, description, imageUrl, price, req.user._id);
    try {
        await product.save()
        res.redirect('/')
    } catch (error) {
        throw error
    }
}

exports.getEditProduct = async (req, res, next) => {
    const productId = req.params.productId
    try {
        const product = await Product.findById(productId)
        if (!product) {
            throw new Error('Product not found.')
        }
        res.render('admin/edit-product', {
            path: "/admin/edit-product",
            pageTitle: "Edit product",
            editMode: true,
            product: product,
        })
    } catch(err) {
        helpers.errorHandle(err)
    }
}

exports.doEditProduct = async (req, res, next) => {
    const productId = req.body.productId
    try {
        const product = await Product.findById(productId)
        if (!product) {
            throw new Error('Product not found.')
        }
        const updatedFields = {
            title: req.body.title,
            imageUrl: req.body.imageUrl,
            description: req.body.description,
            price: req.body.price,
        }
        await Product.updateProductById(productId, updatedFields)
        res.redirect('/admin/products')
    } catch(err) {
        console.error('Error updating record:', err);
    }
}

exports.doDeleteProduct = async (req, res, next) => {
    const productId = req.body.productId
    try {
        await Product.deleteProductById(productId)
        res.redirect('/admin/products')
    } catch (error) {
        helpers.errorHandle(error)
    }
}

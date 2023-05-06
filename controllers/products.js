const Product = require('./../models/product');

exports.getProducts = (req, res, next) => {
    const products = Product.fetchAll()
    res.render('shop', {
        path: "/",
        products: products,
        pageTitle: "Home"
    })
}

exports.getAddProduct = (req, res, next) => {
    res.render('add-product', {
        path: "/admin/add-product",
        pageTitle: "Add product"
    })
}

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title)
    product.save()
    res.redirect('/')
}
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/product-list', {
            path: "/products",
            products: products,
            pageTitle: "All product"
        })
    })
}

exports.getProduct = (req, res, next) => {
    Product.findById(req.params.productId, (product) => {
        res.render('shop/product-detail', {
            product: product
        })
    })
}

exports.getIndexPage = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/index', {
            path: "/",
            products: products,
            pageTitle: "Shop"
        })
    })
}

exports.getCartPage = (req, res, next) => {
    res.render('shop/cart', {
        path: "/cart",
        pageTitle: "Cart"
    })
}

exports.getOrdersPage = (req, res, next) => {
    res.render('shop/orders', {
        path: "/orders",
        pageTitle: "Your orders"
    })
}

exports.getCheckoutPage = (req, res, next) => {
    res.render('shop/checkout', {
        path: "/checkout",
        pageTitle: "Checkout"
    })
}

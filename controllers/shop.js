const Product = require('../models/product');
const Cart = require('../models/cart');

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
    Cart.fetchCartData(cart => {
        Product.fetchAll(products => {
            const cartProducts = []
            for (product of products) {
                existingProduct = cart.products.find(prod => prod.id === product.id);
                if (existingProduct) {
                    cartProducts.push({
                        product: product,
                        quantity: existingProduct.quantity
                    })
                }
            }

            res.render('shop/cart', {
                path: "/cart",
                pageTitle: "Cart",
                cartProducts: cartProducts
            })
        })
    })
}

exports.addToCart = (req, res, next) => {
    const productId = req.body.productId
    Product.findById(productId, (product) => {
        Cart.addProduct(productId, product.price)
        res.redirect('/cart')
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

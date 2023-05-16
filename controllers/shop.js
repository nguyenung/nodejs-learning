const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.findAll({
        order: [['id', 'desc']]
    })
    .then(products => {
        res.render('shop/product-list', {
            path: "/products",
            products: products,
            pageTitle: "All product"
        })
    })
    .catch(err => {
        console.log(err)
    })
}

exports.getProduct = (req, res, next) => {
    Product.findByPk(req.params.productId)
    .then((product) => {
        res.render('shop/product-detail', {
            product: product
        })
    })
    .catch(err => {
        console.log(err)
    })
}

exports.getIndexPage = (req, res, next) => {
    Product.findAll({
        order: [['id', 'desc']]
    })
    .then(products => {
        res.render('shop/index', {
            path: "/",
            products: products,
            pageTitle: "Shop"
        })
    })
    .catch(err => {
        console.log(err)
    })
}

exports.getCartPage = (req, res, next) => {
    Cart.fetchCartData(cart => {
        Product.fetchAll(products => {
            let cartData = {
                products: [],
                totalPrice: cart.totalPrice
            }
            for (product of products) {
                existingProduct = cart.products.find(prod => prod.id === product.id);
                if (existingProduct) {
                    cartData.products.push({
                        product: product,
                        quantity: existingProduct.quantity
                    })
                }
            }

            res.render('shop/cart', {
                path: "/cart",
                pageTitle: "Cart",
                cartData: cartData
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

exports.deleteCartItem = (req, res, next) => {
    const productId = req.body.productId
    Product.findById(productId, product => {
        if (!product) {
            return res.redirect('/')
        }
        Cart.deleteProduct(product.id, product.price)
        return res.redirect('/cart')
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

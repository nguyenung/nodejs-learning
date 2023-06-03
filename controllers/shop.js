const Product = require('./../models/product')
const getPaginatedResults = require('../utils/paginator')
const { loadEnvironmentVariables } = require('./../config/env');
loadEnvironmentVariables()

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.getIndexPage = async (req, res, next) => {
    const paginationData = await getPaginatedResults(req, res, Product)
    res.render('shop/index', {
        path: '/',
        pageTitle: 'Shop',
        isLoggedIn: req.session.isLoggedIn,
        paginationData,
    })
}

exports.getProducts = async (req, res, next) => {
    const paginationData = await getPaginatedResults(req, res, Product)
    res.render('shop/product-list', {
        path: '/products',
        pageTitle: 'All product',
        isLoggedIn: req.session.isLoggedIn,
        paginationData
    })
}

exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.productId)
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            isLoggedIn: req.session.isLoggedIn,
        })
    } catch (err) {
        errorHandler(next, err.message)
    }
}

exports.getCartPage = async (req, res, next) => {
    try {
        const userWithCart = await req.user.populate('cart.items.productId')
        res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Cart',
            cartData: userWithCart.cart,
            isLoggedIn: req.session.isLoggedIn,
        })
    } catch (err) {
        errorHandler(next, err.message)
    }
}

exports.addToCart = async (req, res, next) => {
    try {
        const product = await Product.findById(req.body.productId)
        await req.user.addToCart(product)
        res.redirect('/cart')
    } catch (err) {
        errorHandler(next, err.message)
    }
}

exports.deleteCartItem = async (req, res, next) => {
    const productId = req.body.productId
    try {
        const product = await Product.findById(productId)
        if (product) {
            await req.user.removeFromCart(product)
        }
        res.redirect('/cart')
    } catch (err) {
        errorHandler(next, err.message)
    }
}

exports.createOrder = async (req, res, next) => {
    const cart = req.user.cart
    if (!cart) {
        res.redirect('/')
    }
    await req.user.createOrder()
    res.redirect('/orders')
}

exports.getOrdersPage = async (req, res, next) => {
    const orders = await req.user.getOrders()
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your orders',
        orders: orders,
        isLoggedIn: req.session.isLoggedIn,
    })
}

exports.getCheckoutPage = async (req, res, next) => {
    try {
        const userWithCart = await req.user.populate('cart.items.productId')
        res.render('shop/checkout', {
            path: '/checkout',
            pageTitle: 'Cart',
            cartData: userWithCart.cart,
            isLoggedIn: req.session.isLoggedIn,
        })
    } catch (err) {
        errorHandler(next, err.message)
    }
}

exports.getCheckoutSuccessPage = async (req, res, next) => {
    res.render('shop/checkout-success', {
        path: '/checkout-success',
        pageTitle: 'Success',
        isLoggedIn: req.session.isLoggedIn,
        supportEmail: process.env.SUPPORT_EMAIL
    })
}

exports.getCheckoutCancelPage = async (req, res, next) => {
    res.render('shop/checkout-cancel', {
        path: '/checkout-cancel',
        pageTitle: 'Cancel checkout',
        isLoggedIn: req.session.isLoggedIn,
    })
}

exports.createCheckoutSession = async (req, res, next) => {
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                price: 'price_1NEkSFD0uJpi15ej1pE5AzqY',
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${res.locals.baseUrl}/checkout-success`,
        cancel_url: `${res.locals.baseUrl}/checkout-cancel`,
    });
    res.redirect(303, session.url);
}

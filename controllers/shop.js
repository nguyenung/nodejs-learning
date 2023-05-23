const Product = require('./../models/product');

const helpers = require('./../utils/helpers');

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/product-list', {
                path: '/products',
                products: products,
                pageTitle: 'All product'
            })
        })
        .catch(err => console.log(err))
}

exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.productId);
        console.log(product)
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title
        })
    } catch (err) {
        helpers.errorHandle(err)
    }
}

exports.getIndexPage = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/index', {
                path: '/',
                products: products,
                pageTitle: 'Shop'
            })
        })
        .catch(err => console.log(err))
}

exports.getCartPage = async (req, res, next) => {
    try {
        const cartData = await req.user.getCart()
        res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Cart',
            cartData: cartData
        })
    } catch (error) {
        helpers.errorHandle(error)
    }
}

exports.addToCart = async (req, res, next) => {
    try {
        const productId = req.body.productId
        const product = await Product.findById(productId)
        await req.user.addToCart(product)
        res.redirect('/cart')
    } catch (error) {
        helpers.errorHandle(error)
    }
}

exports.deleteCartItem = async (req, res, next) => {
    const productId = req.body.productId
    try {
        const product = await Product.findById(productId)
        await req.user.removeFromCart(product)
        res.redirect('/cart');
    } catch (err) {
        helpers.errorHandle(err)
    }
}

exports.createOrder = async (req, res, next) => {
    try {
        const cart = await req.user.getCart()
        if (!cart) {
            res.redirect('/')
        }

        await sequelize.transaction(async (transaction) => {
            try {
                const order = await req.user.createOrder({
                    totalPrice: cart.totalPrice
                }, {transaction: transaction})
                const cartProducts = await cart.getProducts()
                await order.addProducts(cartProducts.map(product => {
                    product.OrderItem = {quantity: product.CartItem.quantity}
                    return product
                }), {transaction: transaction})
                transaction.commit()
            } catch(err) {
                transaction.rollback()
                helpers.errorHandle(err)
            }
        });

        res.redirect('/orders');
    } catch(err) {
        helpers.errorHandle(err)
    }
}

exports.getOrdersPage = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your orders'
    })
}

exports.getCheckoutPage = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    })
}

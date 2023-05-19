// const Product = require('../models/product');
const { Product, Cart } = require('./../models');
const helpers = require('./../utils/helpers');


// const Cart = require('../models/cart');

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
        .catch(err => console.log(err))
}

exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.productId)
        const user = await product.getUser()
        res.render('shop/product-detail', {
            product: product,
            user: user,
        })
    } catch (err) {
        helpers.errorHandle(err)
    }
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
        .catch(err => console.log(err))
}

exports.getCartPage = async (req, res, next) => {
    Cart.findOne({
        where: { userId: req.user.id },
        include: [
            {
                model: Product,
                through: { attributes: ['quantity'] } // Include the quantity attribute from the CartItem model
            }
        ]
    })
        .then((cart) => {
            const cartData = cart ? cart.toJSON() : null
            res.render('shop/cart', {
                path: "/cart",
                pageTitle: "Cart",
                cartData: cartData
            })
        })
        .catch((error) => console.error('Error retrieving cart:', error));
}

exports.addToCart = async (req, res, next) => {
    const productId = req.body.productId
    let fetchedCart
    let totalPrice
    try {
        let cart = await req.user.getCart()
        if (!cart) {
            cart = await req.user.createCart({
                totalPrice: 0
            })
        }

        fetchedCart = cart
        const cartProducts = await cart.getProducts({
            where: {id: productId}
        })
        let product
        if (cartProducts.length > 0) {
            product = cartProducts[0]
        }
        let newQuantity
        if (product) {
            const oldQuantity = product.CartItem.quantity
            newQuantity = oldQuantity + 1
        } else {
            newQuantity = 1
            product = await Product.findByPk(productId)
        }
        fetchedCart.addProduct(product, {through: {
            quantity: newQuantity
        }})

        let old = cart.totalPrice
        old += product.price
        cart.totalPrice = old
        await cart.save()
        res.redirect('/cart')
    } catch (err) {
        console.error('Error when add to cart:', err)
    }
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

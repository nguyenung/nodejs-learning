const express = require('express')
const router = express.Router()
const requireAuth = require('./middle-wares/require-auth')
const shopController = require('./../controllers/shop')

router.get('/', shopController.getIndexPage)

router.get('/products', shopController.getProducts)

router.get('/products/:productId', shopController.getProduct)

router.get('/cart', requireAuth, shopController.getCartPage)

router.post('/cart', requireAuth, shopController.addToCart)

router.post('/delete-cart-item', requireAuth, shopController.deleteCartItem)

router.get('/orders', requireAuth, shopController.getOrdersPage)

router.post('/create-order', requireAuth, shopController.createOrder)

// router.get('/checkout', shopController.getCheckoutPage)

exports.router = router

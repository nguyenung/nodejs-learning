const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/require-auth')
const shopController = require('./../controllers/shop')
const chatController = require('./../controllers/chat')

router.get('/', shopController.getIndexPage)

router.get('/products', shopController.getProducts)

router.get('/products/:productId', shopController.getProduct)

router.get('/cart', requireAuth, shopController.getCartPage)

router.post('/cart', requireAuth, shopController.addToCart)

router.post('/delete-cart-item', requireAuth, shopController.deleteCartItem)

router.get('/orders', requireAuth, shopController.getOrdersPage)

router.post('/create-order', requireAuth, shopController.createOrder)

router.post('/create-checkout-session', requireAuth, shopController.createCheckoutSession)

router.get('/checkout', shopController.getCheckoutPage)

router.get('/checkout-success', shopController.getCheckoutSuccessPage)

router.get('/checkout-cancel', shopController.getCheckoutCancelPage)

router.get('/chat', requireAuth, chatController.getChatPage)

router.get('/chat-reply', chatController.doReply)

exports.router = router
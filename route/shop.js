const express = require('express')
const shopController = require('./../controllers/shop');

const router = express.Router()

router.get('/', shopController.getIndexPage)

router.get('/products', shopController.getProducts)

router.get('/products/:productId', shopController.getProduct)

router.get('/cart', shopController.getCartPage)

router.post('/cart', shopController.addToCart)

router.get('/orders', shopController.getOrdersPage)

router.get('/checkout', shopController.getCheckoutPage)

exports.router = router
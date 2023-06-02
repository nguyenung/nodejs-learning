const express = require('express')
const router = express.Router()
const adminController = require('./../controllers/admin')
const requireAuth = require('../middlewares/require-auth')

router.get('/products', requireAuth, adminController.getProducts)

router.get('/add-product', requireAuth, adminController.getAddProduct)

router.post('/add-product', requireAuth, adminController.postAddProduct)

router.get('/edit-product/:productId', requireAuth, adminController.getEditProduct)

router.post('/edit-product', requireAuth, adminController.doEditProduct)

router.delete('/product/:productId', requireAuth, adminController.deleteProduct)

exports.router = router

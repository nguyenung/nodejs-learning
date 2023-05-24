const express = require('express')

const router = express.Router()

const authController = require('./../controllers/auth');

router.get('/login', authController.loginPage)

router.post('/login', authController.login)

router.get('/logout', authController.logout)

exports.router = router
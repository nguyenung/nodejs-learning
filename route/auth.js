const express = require('express')
const router = express.Router()
const requireAuth = require('../middlewares/require-auth')
const authController = require('./../controllers/auth')
const validate = require('./../middlewares/validate')
const signupValidatorRules = require('./../validators/signup-validators')
const loginValidatorRules = require('./../validators/login-validators')

router.get('/login', authController.loginPage)

router.post('/login', validate(loginValidatorRules), authController.login)

router.post('/logout', requireAuth, authController.logout)

router.get('/signup', authController.signupPage)

router.post('/signup', validate(signupValidatorRules), authController.signup)

exports.router = router
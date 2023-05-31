const express = require('express')
const router = express.Router()
const requireAuth = require('../middlewares/require-auth')
const requireGuest = require('../middlewares/require-guest')
const authController = require('./../controllers/auth')
const validate = require('./../middlewares/validate')
const signupValidatorRules = require('./../validators/signup-validators')
const loginValidatorRules = require('./../validators/login-validators')
const newPasswordValidatorRules = require('./../validators/new-password-validators')

router.get('/login', requireGuest, authController.loginPage)

router.post('/login', [requireGuest, validate(loginValidatorRules)], authController.login)

router.post('/logout', requireAuth, authController.logout)

router.get('/signup', authController.signupPage)

router.post('/signup', validate(signupValidatorRules), authController.signup)

router.get('/forgot-password', requireGuest, authController.forgotPasswordPage)

router.post('/reset-password', requireGuest, authController.resetPassword)

router.get('/new-password', requireGuest, authController.newPasswordPage)

router.post('/new-password-hi', [requireGuest, validate(newPasswordValidatorRules)], authController.createNewPassword)

exports.router = router
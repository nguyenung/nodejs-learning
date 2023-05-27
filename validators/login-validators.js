const { body } = require('express-validator')
const User = require('./../models/user')

const loginValidatorRules = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email')
        .custom(async value => {
            const user = await User.findOne({ email: value })
            if (!user) {
                throw new Error('Email not exist.')
            }
            return true
        }),

    body('password').notEmpty()
        .withMessage('Password is required')
]

module.exports = loginValidatorRules

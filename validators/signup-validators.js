const { body } = require('express-validator')
const User = require('../models/user')

const signupValidatorRules = [
    body('name').notEmpty()
        .withMessage('Name is required'),

    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email')
        .custom(async (value) => {
            const user = await User.findOne({ email: value })
            if (user) {
                throw new Error('Email already exists')
            }
            return true
        }),

    body('password').isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    body('confirm_password')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
]

module.exports = signupValidatorRules

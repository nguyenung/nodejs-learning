const { body } = require('express-validator')

const newPasswordValidatorRules = [
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

module.exports = newPasswordValidatorRules

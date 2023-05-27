const { validationResult } = require('express-validator')

const validate = (validationRules) => {
    return async (req, res, next) => {
        await Promise.all(validationRules.map(validationRule => validationRule.run(req)))

        const errors = validationResult(req)
        if (errors.isEmpty()) {
            return next()
        }
        const errorMsgs = errors.array().map(error => error.msg)
        const strError = JSON.stringify(errorMsgs)
        req.flash('error', strError)
        return res.redirect(req.originalUrl);
    }
}

module.exports = validate
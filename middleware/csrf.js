const csrfValidationMiddleware = (req, res, next) => {
    const token = req.body._csrf
    console.log(req.csrfToken())
    if (req.method !== 'GET' && !token) {
        return res.status(403).send({ error: 'No CSRF token provided.' })
    }
    if (req.csrfToken() !== token) {
        return res.status(403).send({ error: 'Invalid CSRF token.' })
    }
}

module.exports = csrfValidationMiddleware

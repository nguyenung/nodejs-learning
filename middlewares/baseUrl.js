const getBaseUrl = (req, res, next) => {
    const protocol = req.protocol
    const host = req.get('host')
    const baseUrl = `${protocol}://${host}`

    res.locals.baseUrl = baseUrl
    next()
}

module.exports = getBaseUrl
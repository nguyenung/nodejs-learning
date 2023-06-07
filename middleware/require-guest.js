const requireGuest = (req, res, next) => {
    if (req.session && req.session.user) {
        res.redirect('/')
    } else {
        return next()
    }
}

module.exports = requireGuest

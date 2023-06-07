const requireAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        return next()
    } else {
        req.flash('error', 'You need to login first.')
        res.redirect('/login')
    }
}

module.exports = requireAuth

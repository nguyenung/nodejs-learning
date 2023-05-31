exports.pageNotFound = (req, res, next) => {
    res.status(404).render('errors/404', {
        isLoggedIn: req.session.isLoggedIn,
    })
}

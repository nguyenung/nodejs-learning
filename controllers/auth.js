
exports.loginPage = (req, res, next) => {
    // console.log(req.get('Cookie').split(';')[1].trim().split('=')[1])
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isLoggedIn: req.session.isLoggedIn,
    })
}

exports.login = (req, res, next) => {
    req.session.isLoggedIn = true
    // res.setHeader('Set-Cookie', 'isLoggedIn=true')
    res.redirect('/')
}

exports.logout = (req, res, next) => {
    // res.setHeader('Set-Cookie', 'isLoggedIn=false')
    res.redirect('/')
}

const User = require('./../models/user');

exports.loginPage = (req, res, next) => {
    // console.log(req.get('Cookie').split(';')[1].trim().split('=')[1])
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isLoggedIn: req.session.isLoggedIn,
    })
}

exports.login = (req, res, next) => {
    User.findById('646cc0f246e948b485c28b22')
    .then(user => {
        req.session.isLoggedIn = true
        req.session.user = user
        req.session.save((err) => {
            res.redirect('/')
        })
    })
    .catch(err => console.log(err))
}

exports.logout = (req, res, next) => {
    if (req.session.isLoggedIn) {
        req.session.destroy(() => {
            res.redirect('/')
        })
    } else {
        throw new Error('You must log in first.')
    }
}

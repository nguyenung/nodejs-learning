const bcrypt = require('bcrypt')
const User = require('./../models/user')

exports.signupPage = (req, res, next) => {
    // Get flash messages from the session
    const successMessage = req.flash('success');
    const errorMessage = req.flash('error');
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        isLoggedIn: req.session.isLoggedIn,
        successMessage,
        errorMessage,
    })
}

const validateSignup = async (name, email, password, confirm_password) => {
    let invalid
    let errorMessage
    const user = await User.findOne({ email: email })
    if (!name || !email || !password || !confirm_password) {
        invalid = true
        errorMessage = 'Email, password and confirm password is required.'
    } else if (user) {
        invalid = true
        errorMessage = 'Email has already been registered.'
    } else if(password!== confirm_password) {
        errorMessage = 'Passwords do not match.'
        invalid = true
    }
    return { invalid, errorMessage }
}
exports.signup = async (req, res, next) => {
    try {
        const {name, email, password, confirm_password} = req.body
        const validate = await validateSignup(name, email, password, confirm_password)
        if (validate.invalid) {
            req.flash('error', validate.errorMessage)
            return res.redirect('/signup')
        }
        // Generate a salt with a specified number of rounds (10 is a common value)
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds)
        const hashPassword = await bcrypt.hash(password, salt)
        const newUser = new User({
            name: name,
            email: email,
            password: hashPassword,
            cart: {
                items: [],
                totalPrice: 0
            }
        })
        await newUser.save()
        req.session.isLoggedIn = true
        req.session.user = newUser
        req.session.save((err) => {
            res.redirect('/')
        })
    } catch (error) {
        console.error(error)
    }
}

exports.loginPage = (req, res, next) => {
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

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

exports.signup = async (req, res, next) => {
    try {
        const {name, email, password} = req.body
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

exports.login = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email: email})
        // Load hash from your password DB.
        bcrypt.compare(password, user.password, function(err, isMatch) {
            if (err) {
                // Handle error
                console.error('Error comparing passwords:', err)
                req.flash('error', 'Error comparing passwords')
                return res.redirect('/login')
            }
            
            if (isMatch) {
                req.session.isLoggedIn = true
                req.session.user = user
                return res.redirect('/')
            } else {
                req.flash('error', 'Password is incorrect')
                return res.redirect('/login')
            }
        })
    } catch (error) {
        console.error(error)
    }
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

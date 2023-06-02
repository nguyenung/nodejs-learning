const bodyParser = require('body-parser')
const express = require('express')
// require('express-async-errors')
const errorController = require('./controllers/error')
const mongoose = require('mongoose')
const helpers = require('./utils/helpers')
const User = require('./models/user')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const flash = require('connect-flash')
const csrf = require('csurf')
const baseUrl = require('./middlewares/baseUrl')
const methodOverride = require('method-override')
const multer = require('multer')


const dotenv = require('dotenv')
dotenv.config()
const environment = process.env.NODE_ENV || 'local'
dotenv.config({ path: `.env.${environment}` })

//Live reload when save file
const livereload = require('livereload')
const connectLiveReload = require('connect-livereload')
const liveReloadServer = livereload.createServer()
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/")
    }, 100)
})

const app = express()

app.use(connectLiveReload())

app.use(baseUrl)

// 1. set template engine and views folder
app.set('view engine', 'pug')
app.set('views', 'views')

/****************************
 *** Implement middleware ***
 ***************************/

// 2. load body-parser
// fill data from request to req.body
app.use(bodyParser.urlencoded({ extended: true }))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '.tmp')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
app.use(multer({storage, fileFilter}).single('image'))

// 3. config folder static
app.use(express.static('public'))

const store = new MongoDBStore({
    uri: process.env.DB_MONGODB_CREDENTIAL,
    collection: 'sessions'
})
store.on('error', (error) => {
    console.error('MongoDBStore Error:', error)
})

app.use(session({
    secret: process.env.SESSION_SECRET,
    store: store,
    resave: false,
    saveUninitialized: false
}))

app.use(flash())
app.use((req, res, next) => {
    let flashMessages = req.flash()
    if (flashMessages) {
        if (flashMessages.error && helpers.isValidJSON(flashMessages.error)) {
            flashMessages.error = JSON.parse(flashMessages.error)
        } else {
            flashMessages.error = [flashMessages.error]
        }
        res.locals.messages = flashMessages
    }
    next()
})

app.use(csrf())
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken()
    next()
})

// error handler
app.use(function (err, req, res, next) {
    console.log(req.body)
    console.log(err.code)
    if (err.code !== 'EBADCSRFTOKEN') {
        return next(err)
    }

    // handle CSRF token errors here
    res.status(403)
    res.send('CSRF token is missing')
})

app.use(async (req, res, next) => {
    try {
        if (!req.session.user) {
            res.locals.user = req.session.user
            return next()
        }
        const user = await User.findById(req.session.user._id)
        if (user) {
            req.user = user
            res.locals.user = user
            next()
        }
    } catch (error) {
        console.log(error)
    }
})

// 4. load route
//app.use(an instance of express.Router())

const shopRouters = require('./route/shop')
const adminRouters = require('./route/admin')
const authRouters = require('./route/auth')

app.use('/admin', adminRouters.router)
app.use(shopRouters.router)
app.use(authRouters.router)

app.use(methodOverride())
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500)
    res.render('error', { error: err.message })
})

// 5. set 404 page
app.use(errorController.pageNotFound)

mongoose.connect(process.env.DB_MONGODB_CREDENTIAL)
    .then(result => {
        console.log('Connected to MongoDB though mongoose')
        app.listen(3000)
    })
    .catch(err => {
        console.log(err)
    })

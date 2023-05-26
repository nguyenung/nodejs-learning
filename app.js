const bodyParser = require('body-parser')
const express = require('express')
const errorController = require('./controllers/error')
const mongoose = require('mongoose')
const User = require('./models/user')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const flash = require('connect-flash')

const dotenv = require('dotenv');
dotenv.config()
const environment = process.env.NODE_ENV || 'local'
dotenv.config({ path: `.env.${environment}` })

//Live reload when save file
const livereload = require('livereload')
const connectLiveReload = require('connect-livereload')
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});

const app = express()

app.use(connectLiveReload())

// 1. set template engine and views folder
app.set('view engine', 'pug')
app.set('views', 'views')

/****************************
 *** Implement middleware ***
 ***************************/

// 2. load body-parser
// fill data from request to req.body
app.use(bodyParser.urlencoded({ extended: true }))

// 3. config folder static
app.use(express.static('public'))

const store = new MongoDBStore({
    uri: process.env.DB_MONGODB_CREDENTIAL,
    collection: 'sessions'
})

store.on('error', (error) => {
    console.error('MongoDBStore Error:', error);
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    store: store,
    resave: false,
    saveUninitialized: false
}))
app.use(flash())

app.use(async (req, res, next) => {
    try {
        if (!req.session.user) {
            res.locals.user = req.session.user;
            return next()
        }
        const user = await User.findById(req.session.user._id)
        if (user) {
            req.user = user
            res.locals.user = user;
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

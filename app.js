const bodyParser = require('body-parser')
const express = require('express')
const errorController = require('./controllers/error')
const mongoConnect = require('./utils/database').mongoConnect;
const User = require('./models/user')

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

app.use(async (req, res, next) => {
    try {
        const user = await User.findById("646ae19ecd7e8518b93d32ec")
        req.user = new User(user.name, user.email, user.password, user._id, user.cart)
    } catch (error) {
        console.log(error)
    }
    next()
})

// 4. load route
//app.use(an instance of express.Router())


const shopRouters = require('./route/shop')
const adminRouters = require('./route/admin')

app.use('/admin', adminRouters.router)
app.use(shopRouters.router)


// 5. set 404 page
app.use(errorController.pageNotFound)

mongoConnect(() => {
    app.listen(3000)
})

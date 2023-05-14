const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const errorController = require('./controllers/error');

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
app.use(bodyParser.urlencoded({extended: true}))

// 3. config folder static
app.use(express.static('public'))

// 4. load route
//app.use(an instance of express.Router())
const shopRouters = require('./route/shop')
const adminRouters = require('./route/admin')

app.use('/admin', adminRouters.router)
app.use(shopRouters.router)

// 5. set 404 page
app.use(errorController.pageNotFound)

app.listen(3000)
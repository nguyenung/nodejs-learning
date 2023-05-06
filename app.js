const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')

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

// 1. chỉ định template engine, views folder
app.set('view engine', 'pug')
app.set('views', 'views')

/**************************
 *** Nạp các middleware ***
 **************************/

// 2. load body-parser
// mục đích của body parser: lấy dữ liệu từ request đưa vào req.body
app.use(bodyParser.urlencoded({extended: true}))

// 3. chỉ định folder static
app.use(express.static('public'))

// 4. nạp các route
//app.use(1 instance của express.Router())
const shopRouters = require('./route/shop')
const adminRouters = require('./route/admin')

app.use('/admin', adminRouters.router)
app.use(shopRouters.router)

// 5. set 404 page
app.use((req, res, next) => {
    res.status(404).render('404')
})

app.listen(3000)
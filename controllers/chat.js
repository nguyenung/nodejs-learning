const io = require('./../socket')

exports.getChatPage = (req, res, next) => {
    res.render('chat/chat', {
        path: '/chat',
        pageTitle: 'Chat',
        isLoggedIn: req.session.isLoggedIn,
    })
}

exports.doReply = (req, res, next) => {
    io.getIO().emit('newMessage', 'Hello back from controller')
    res.status(200).json({message: 'Message sent'})
}
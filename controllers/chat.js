exports.getChatPage = (req, res, next) => {
    res.render('chat/chat', {
        path: '/chat',
        pageTitle: 'Chat',
        isLoggedIn: req.session.isLoggedIn,
    })
}

exports.doReply = (io, req, res, next) => {
    io.emit('newMessage', 'Hello back from controller')
    res.status(200).json({message: 'Message sent'})
}
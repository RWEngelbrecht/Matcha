const express   = require('express');
const path      = require('path');
const router	= express.Router();
const Message	= require('../models/messages');
const User      = require('../models/umod');
const io        = require("../app.js");
var from, to, chatID;

// routes
router.get('/messages', (req, res) => {
    if (req.session.user == 0 || !req.session.user) {
        res.redirect('/login');
    }
    var chatters = [];
    var conversations = [];
    // find any chatIDs where session.user.username appears
    Message.find({ $text: {$search: req.session.user.username}}).distinct('chatID').then(chats => {
        chats.forEach(chat => {
            chatters = chat.split('-');
            conversations.push({
                id: chat,
                chatTo: chatters.filter(function(value) {
                    return value != req.session.user.username;
                })
            })
        });
        res.render(path.resolve('views/chat'), {chats: conversations});
    });
})

router.get('/messages/:id', (req, res) => {
    if (req.session.user == 0 || !req.session.user) {
        res.redirect('/login');
    }
    from = req.session.user.username;
    chatID = req.params.id;
    var chatters = req.params.id.split('-');
    User.findOne({$and: [{username: {$in: chatters}}, {username: {$ne: from} }]})
    .then(toUsr => {
        to = toUsr.username;
        Message.find({chatID: chatID}, (err, messages) => {
            res.render(path.resolve('views/messages'), {messages: messages, from: from, chatID: chatID});
        })
    })
});

io.on('connection', (socket) => {
    console.log("new user connected");
    // set username. // from would never be anyone else than logged in user
    socket.username = from;
    // listen on new message
    socket.on('new_message', (data) => {
        var message = data.message;
        // show message
        io.sockets.emit('new_message', {message : message, username: socket.username});
        var newMessage = new Message({
            chatID: chatID,
            sentBy: from,
            sentTo: to,
            message: message
        });
        newMessage.save().then(() => console.log('message saved to db'));
    });
});
module.exports = router;
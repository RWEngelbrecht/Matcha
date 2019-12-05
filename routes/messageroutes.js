const express   = require('express');
const path      = require('path');
const router	= express.Router();
const Message	= require('../models/messages');
const io        = require("../app.js");
var from, to, chatid;

// routes
router.get('/messages', (req, res) => {
    if (req.session.user == 0 || !req.session.user) {
        res.redirect('/login');
    }
    from = req.session.user.username;
    Message.find({chatID: "ArataGeorgia"}, (err, messages) => {
        res.render(path.resolve('views/messages'), {messages: messages});
    })
});

io.on('connection', (socket) => {
    console.log("new user connected");
    // set username.
    socket.username = "Arata";
    // listen on change_username
    socket.on('change_username', (data) => {
        socket.username = data.username;
    });
    // listen on new message
    socket.on('new_message', (data) => {
        var message = data.message;
        console.log(from);
        // show message
        io.sockets.emit('new_message', {message : data.message, username: socket.username});
    });
});
module.exports = router;
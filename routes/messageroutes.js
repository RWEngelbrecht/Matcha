const express	= require('express');
const path	= require('path');
const router	= express.Router();
const messaage	= require('../controllers/messages.js');
const io = require("../app.js");

// routes
router.get('/messages', (req, res) => {
    res.render(path.resolve('views/messages'));
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
        // show message
        io.sockets.emit('new_message', {message : data.message, username: socket.username});
    });
});
module.exports = router;
const express   = require('express');
const path      = require('path');
const router	= express.Router();
const Message	= require('../models/messages');
const User      = require('../models/umod');
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
        Message.updateMany({chatID: chatID, sentTo: from}, {read:true}, (err, chat) => {
            if (err) {
                console.error(err);
            }
        });
        Message.find({chatID: chatID}, (err, messages) => {
            res.render(path.resolve('views/messages'), {messages: messages, chatFrom: from, chatTo: to, chatID: chatID});
        });
    });
});

module.exports = router;
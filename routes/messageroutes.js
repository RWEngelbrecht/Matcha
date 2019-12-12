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
	var currUser = req.session.user;
	Message.find({$or: [{sentTo: currUser.username}, {sentBy: currUser.username}]}, (err, messages) => {
		var chatters = [];
		var conversations = [];

		messages.forEach(msg => {
			chatters = msg.chatID.split('-');
			conversations.push({
                id: msg.chatID,
                chatTo: chatters.filter(function(value) {
                    return value != currUser.username;
                })
			});
		});
		res.render(path.resolve('views/chat'), {chats: conversations, user: currUser});
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
            res.render(path.resolve('views/messages'), {messages: messages, chatFrom: from, chatTo: to, chatID: chatID, user: req.session.user});
        });
    });
});

module.exports = router;

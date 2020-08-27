const express   = require('express');
const path      = require('path');
const router	= express.Router();
const Message	= require('../models/messages');
const User      = require('../models/umod');
const knex = require('../database');
var from, to, chatID;


// routes
router.get('/messages', (req, res) => {
    if (req.session.user == 0 || !req.session.user) {
        res.redirect('/login');
    }
    else {
	    var currUser = req.session.user;
	    // Message.find({$or: [{sentTo: currUser.username}, {sentBy: currUser.username}]}).distinct('chatID',(err, chats) => {
            knex('message')
                .where({sentTo: currUser.username})
                .orWhere({sentBy: currUser.username})
                .distinct('chatID')
                .then((doc) => {
                    console.log("HERE " + JSON.stringify(doc))
                    var chatters = [];
	    	        var conversations = [];

	    	        doc.forEach(chat => {
	    		    chatters = chat.chatID.split('-');
	    		    conversations.push({
                        id: chat.chatID,
                        chatTo: chatters.filter(function(value) {
                            return value != currUser.username;
                        })
	    		    });
	    	    });
	    	res.render(path.resolve('views/chat'), {chats: conversations, user: currUser});
        })
    }
});


router.get('/messages/:id', (req, res) => {
    if (req.session.user == 0 || !req.session.user) {
        res.redirect('/login');
    }
    from = req.session.user.username;
    chatID = req.params.id;
    var chatters = req.params.id.split('-');
    var index = chatters.indexOf(from);
    if (index > -1) {
       chatters.splice(index, 1);
    }
    // User.findOne({$and: [{username: {$in: chatters}}, {username: {$ne: from} }]})
    knex('user')
        .where({username: chatters[0]})
        .then(toUsr => {
            to = toUsr[0].username;
            knex('message')
                .where({chatID: chatID, sentTo: from})
                .update({read:true})
            knex('message')
                .where({chatID: chatID})
                .then((messages) => {
                    res.render(path.resolve('views/messages'), {messages: messages, chatFrom: from, chatTo: to, chatID: chatID, user: req.session.user});          
                })
    });
});

module.exports = router;


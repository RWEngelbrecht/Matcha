const Message	= require("../models/messages.js");
const User= require("../models/umod.js");
const Likes = require('../models/likemod');
const Notifications = require('../models/notifmod');
const io = require('../app.js');

module.exports = function(connectedUsers) {

	io.sockets.on('connection', function (socket) {
		var user = {};

		// adds email and socket id to connectedUsers arr on login
		socket.on('login', function(data) {
			User.findOne({email: data.email}, function(err, doc) {
				if (err) throw error;
				if (doc) {
					var verif = 0;
					user.user = doc.username;
					user.socketId = socket.id;
					for (var i in connectedUsers) {
						if (connectedUsers[i].user == doc.username) {
							connectedUsers[i].socketId = user.socketId;
							verif = 1;
						};
					};
					if (verif == 0) {
						connectedUsers.push(user);
					};
				}
			});
		});

		// updates the connectedusers array to get the new socket id coming from client side
		socket.on('update', function(data) {
			var check = 0;
			for (var i in connectedUsers) {
				if (connectedUsers[i].user == data.user) {
					connectedUsers[i].socketId = data.id;
					check = 1;
				}
			}
			if (check === 0) {
				user.user = data.user
				user.socketId = data.id
				connectedUsers.push(user);
			}
		})

		// message handler
		socket.on('new_message', (data) => {
			for (var i in connectedUsers) {
				if (connectedUsers[i].user === data.chatFrom) {
					io.sockets.to(connectedUsers[i].socketId).emit('new_message', {message: data.message, username: data.chatFrom, chatID: data.chatID});
				}
				if (connectedUsers[i].user === data.chatTo) {
					io.sockets.to(connectedUsers[i].socketId).emit('new_message', {message: data.message, username: data.chatFrom, chatID: data.chatID});
				}
			}
			var newMessage = new Message({
				chatID: [data.chatFrom, data.chatTo].sort().join('-'),
				sentBy: data.chatFrom,
				sentTo: data.chatTo,
				message: data.message
			});
			newMessage.save();
		});

		// notif on like handler
		socket.on('new_like', (data) => {
			Likes.find({liker: data.liked}, (err, user_likes) => {
				var match = 0;
				user_likes.forEach(user => {
					if (user.liked === data.liker) {
						// you have a match
						User.findOne({username: data.liked}, function (err, doc){
							var notifs = doc.notif + 1
							if (doc.loggedIn === false) {
								var notification = new Notifications({
									notifiedUser: doc.username,
									notifType: "like",
									notifBody: `You have been liked by ${data.liker}`
								});
								notification.save(err => {
									if (err) {
										res.status(400).send(err);
									}
								});
								User.findOneAndUpdate({username: data.liked}, {$set:{notif: notifs}}, function(err, doc) {
									if (err) {
										console.log(err);
									}
								});
							}
						})
						for(var i in connectedUsers) {
							if (connectedUsers[i].user === data.liked) {
								io.sockets.to(connectedUsers[i].socketId).emit('new_notification', {message: "You have a new match with", user: data.liker});
							}
						}
					}
				});
				if (match === 0) {
					User.findOne({username: data.liked}, function (err, doc){
						var notifs = doc.notif + 1
						if (doc.loggedIn === false) {
							var notification = new Notifications({
								notifiedUser: doc.username,
								notifType: "like",
								notifBody: `You have a new match with ${data.liker}`
							});
							notification.save(err => {
								if (err) {
									res.status(400).send(err);
								}
							});
							User.findOneAndUpdate({username: data.liked}, {$set:{notif: notifs}}, function(err, doc) {
								if (err) {
									console.log(err);
								}
							});
						}
					})
					for(var i in connectedUsers) {
						if (connectedUsers[i].user === data.liked) {
							io.sockets.to(connectedUsers[i].socketId).emit('new_notification', {message: "You have been liked by", user: data.liker});
						}
					}
				};
			});
		});

		// notifs on login
		socket.on('login_notif', (data) => {
			// TODO, handle notifs on login.
			// search for more than one interest
			// fix like only working on the first button.
			Notifications.find()
		});
	});
}
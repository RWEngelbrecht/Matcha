const Message	= require("../models/messages.js");
const User= require("../models/umod.js");
const Likes = require('../models/likemod');
const Notifications = require('../models/notifmod');
const nodemailer = require('nodemailer');
const io = require('../app.js');

function sendEmail(to, message, subject) {

	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: "wethinkcodematcha@gmail.com",
			pass: "Matcha1matcha"
		}
	});
	var mailOptions = {
		from: 'wethinkcodematcha@gmail.com',
		to: to,
		subject: subject,
		html: `<h1>` + message + `</h1>`
	};
	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}

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
			User.findOne({username: data.user}, (err, doc) => {
				if (doc) {
					if (doc.notif > 0 && data.page == "http://localhost:8000/") {
						io.sockets.to(data.id).emit('new_notification', {message: "You have " + doc.notif + " notification/s, please check your email"});
						User.findOneAndUpdate({username: data.user}, {$set: {notif: 0}}, (err, doc) => {
							if (err) {
								console.log(err);
							}
						})
					};
				};
			})
		})

		// message handler
		socket.on('new_message', (data) => {
			for (var i in connectedUsers) {
				if (connectedUsers[i].user === data.chatFrom) {
					io.sockets.to(connectedUsers[i].socketId).emit('new_message', {message: data.message, username: data.chatFrom, chatID: data.chatID});
				}
				if (connectedUsers[i].user === data.chatTo) {
					io.sockets.to(connectedUsers[i].socketId).emit('new_message', {message: data.message, username: data.chatFrom, chatID: data.chatID});
					io.sockets.to(connectedUsers[i].socketId).emit('message_notification', {message: data.message, username: data.chatFrom, chatID: data.chatID});
				}
			}
			User.findOne({username: data.chatTo}, (err, doc) => {
				if (doc.loggedIn === false) {
					sendEmail(doc.email, `You have a new message from ${data.chatFrom}`, "You have a new message");
					var notification = new Notifications({
						notifiedUser: doc.username,
						notifType: "message",
						notifBody: `You have a new message from ${data.chatFrom}`
					});
					notification.save(err => {
						if (err) {
							res.status(400).send(err);
						}
					});
					var notifs = doc.notif + 1;
					User.findOneAndUpdate({username: data.chatTo}, {$set:{notif: notifs}}, (err, doc) => {
						if (err) {
							console.log(err);
						}
					})
				}
			})
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
								sendEmail(doc.email, `You have a new match with ${data.liker}`, "You have a new match");
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
							sendEmail(doc.email, `You have been liked by ${data.liker}`, "You have a new like");
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

		// listen for a new view
		socket.on('new_view', (data) => {
			User.findOne({username: data.viewed}, (err, doc) => {
				var notifs = doc.notif + 1
				if (doc.loggedIn === false) {
					var notification = new Notifications({
						notifiedUser: doc.username,
						notifType: "view",
						notifBody: `You have been viewed ${data.viewer}`
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
					sendEmail(doc.email, `You have been viewed by ${data.viewer}`, "You have been viewed");
				}
			});
			for(var i in connectedUsers) {
				if (connectedUsers[i].user === data.viewed) {
					io.sockets.to(connectedUsers[i].socketId).emit('new_notification', {message: "You have been viewed by", user: data.viewer});
				}
			}
		})
	});
}
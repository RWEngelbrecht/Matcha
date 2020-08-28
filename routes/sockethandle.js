const nodemailer = require('nodemailer');
const io = require('../app.js');
const knex = require("../database.js");
const Knex = require("knex");

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
			knex.select('username').from('user').where({email: data.email})
				.then(doc => {
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
			knex.select('notif').from('user').where({username: data.user})
				.then(doc => {
					if (doc.notif > 0 && data.page == "http://localhost:3001/") {
						io.sockets.to(data.id).emit('new_notification', {message: "You have " + doc.notif + " notification/s, please check your email"});
						knex('user')
  							.where({username: data.user})
							.update({ notif: 0})
					};
				})
		})

		// message handler
		socket.on('new_message', (data) => {
			console.log("HERE")
			console.log(data)
			for (var i in connectedUsers) {
				if (connectedUsers[i].user === data.chatFrom && data.message != '') {
					io.sockets.to(connectedUsers[i].socketId).emit('new_message', {message: data.message, username: data.chatFrom, chatID: data.chatID});
				}
				if (connectedUsers[i].user === data.chatTo && data.message != '') {
					io.sockets.to(connectedUsers[i].socketId).emit('new_message', {message: data.message, username: data.chatFrom, chatID: data.chatID});
					io.sockets.to(connectedUsers[i].socketId).emit('message_notification', {message: data.message, username: data.chatFrom, chatID: data.chatID});
				}
			}
			knex.select('loggedIn', 'email', 'username').from('user').where({username: data.chatTo})
			.then(doc => {
				// User.findOne({username: data.chatTo}, (err, doc) => {
				if (doc.loggedIn === false) {
					sendEmail(doc.email, `You have a new message from ${data.chatFrom}`, "You have a new message");
					var notifs = doc.notif + 1;
					knex('user').where({username: data.chatTo}).update({notif: notifs})	
				}
			})
			knex('message')
			.insert({ chatID: [data.chatFrom, data.chatTo].sort().join('-'),
				sentBy: data.chatFrom,
				sentTo: data.chatTo,
				message: data.message
		 	}).then(() => {})
		});

		// notif on like handler
		socket.on('new_like', (data) => {
			knex('user')
  				.where({ usernamers: data.liked })
  				.then(user_likes => {
					var match = 0;
					user_likes.forEach(user => {
					if (user.liked === data.liker) {
						knex('like')
  							.where({username: data.liked})
							.then((doc) => {
								var notifs = doc.notif + 1
								knex('user')
								.where({username: data.liked})
								.update({notif: notifs})
								.then(() => {
									sendEmail(doc.email, `You have a new match with ${data.liker}`, "You have a new match");
							})
						})
						for(var i in connectedUsers) {
							if (connectedUsers[i].user === data.liked) {
								io.sockets.to(connectedUsers[i].socketId).emit('new_notification', {message: "You have a new match with", user: data.liker});
							}
						}
					}	  
				})
				if (match === 0) {
					knex('user')
					.where({username: data.liked})
					.then((doc) => {
						var notifs = doc.notif + 1
						knex('user')
							.where({username: data.liked})
							.update({notif: notifs})
							.then(() => {
								sendEmail(doc.email, `You have been liked by ${data.liker}`, "You have a new like");
						})
					})
					for(var i in connectedUsers) {
						if (connectedUsers[i].user === data.liked) {
							io.sockets.to(connectedUsers[i].socketId).emit('new_notification', {message: "You have been liked by", user: data.liker});
						}
					}
				}
			});
		});

		// listen for a new view
		socket.on('new_view', (data) => {
			knex('user')
				.where({username: data.viewed})
				.then((doc) => {
					var notifs = doc.notif + 1
					knew('user')
						.where({username: data.viewed})
						.update({notif: notifs})
						.then(() => {
							sendEmail(doc.email, `You have been viewed by ${data.viewer}`, "You have been viewed");
						})
				})
				var exist = 0;
				doc.viewedBy.forEach(eye => {
					if (eye === data.viewer) {
						exist = 1;
					}
				});
				if (exist === 0) {
					knex('like')
					.insert({ liked: data.liked, likedUser: data.liked, liker: data.viewer, likeBy: data.viewer})
				}
				for(var i in connectedUsers) {
					if (connectedUsers[i].user === data.viewed) {
						io.sockets.to(connectedUsers[i].socketId).emit('new_notification', {message: "You have been viewed by", user: data.viewer});
					}
				}
			});
		})
}
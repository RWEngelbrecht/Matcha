const Message	= require("../models/messages.js");
const User= require("../models/umod.js");
const io = require('../app.js');

module.exports = function(connectedUsers) {

	io.sockets.on('connection', function (socket) {
		console.log("some id coming from connection", socket.id)
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
			console.log("update data -->", data)
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
			console.log('connected users after update', connectedUsers)
		})

		socket.on('new_message', (data) => {
			console.log("data coming in as a paramater ->", data);
			for (var i in connectedUsers) {
				if (connectedUsers[i].user === data.chatFrom) {
					console.log("emitting now");
					// if we know who should be emitted to (eg with chatID), we can limit who we emit to.
					// Might need to join room at some point
					if (data.chatID.includes(data.chatFrom))
						io.sockets.to(connectedUsers[i].socketId).emit('new_message', {message: data.message, username: data.chatFrom, chatID: data.chatID});
				}
				if (connectedUsers[i].user === data.chatTo) {
					console.log("emitting now");
					if (data.chatID.includes(data.chatTo))
						io.sockets.to(connectedUsers[i].socketId).emit('new_message', {message: data.message, username: data.chatFrom, chatID: data.chatID});
				}
			}
			var newMessage = new Message({
				chatID: [data.chatFrom, data.chatTo].sort().join('-'),
				sentBy: data.chatFrom,
				sentTo: data.chatTo,
				message: data.message
			});
			newMessage.save().then(() => console.log('message saved to db'));
		});
	});
}

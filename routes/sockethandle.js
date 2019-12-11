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
			for (var i in connectedUsers) {
				if (connectedUsers[i].user == data.user) {
					connectedUsers[i].socketId = data.id;
				}
			}
			console.log('connected users', connectedUsers)
		})
		
		socket.on('new_message', (data) => {
			console.log("data coming in as a paramater ->", data);
			for (var i in connectedUsers) {
				if (connectedUsers[i].user === data.chatFrom) {
					console.log("emitting now");
					io.sockets.to(connectedUsers[i].socketId).emit('new_message', {message: "SPECIFIC", username: "SPECIFIC"});
					io.sockets.emit('new_message', {message: "ALL", username: "ALL"});
				}
			}
		// 	var newMessage = new Message({
		// 		chatID: chatID,
		// 		sentBy: data.chatFrom,
		// 		sentTo: data.chatTo,
		// 		message: message
		// 	});
		// 	newMessage.save().then(() => console.log('message saved to db'));
		});
	});
}
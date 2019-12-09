const Message	= require("../models/messages.js");
const User= require("../models/umod.js");
const io = require('../app.js');

module.exports = function(connectedUsers) {
	
	io.on('connection', (socket) => {
		var user = {};
		
		// adds email and socket id to connectedUsers arr on login
		socket.on('login', (data) => {
			User.findOne({email: data.email}, function(err, doc) {
				user.user = doc.username;
				user.id = socket.id;
				connectedUsers.push(user)
			});
		})

		// socket.on('join_chat', function (data) {
		// 	socket.join(data.chatID)
		// 	console.log('data.chatID:', data.chatID);
		// 	// console.log('socket rooms', io.sockets.adapter.rooms);
		// });

		socket.on('new_message', (data) => {
			var from, to;
			var message = data.message;
			var chatID = data.chatID;

			connectedUsers.forEach(con => {
				if (con.user == data.chatFrom) {
					from = con.id;
				}
				if (con.user == data.chatTo) {
					to = con.id;
				}
			});
			// chat should have a message from 1 if sending to specific room works
			// 2 is just to make sure it is sending in general
			io.sockets.in(io.sockets.adapter.rooms.chatID).emit('new message', {message: message, username: 1 });
			io.sockets.emit('new_message', {message : message, username: 2});
			var newMessage = new Message({
				chatID: chatID,
				sentBy: data.chatFrom,
				sentTo: data.chatTo,
				message: message
			});
			// newMessage.save().then(() => console.log('message saved to db'));
		});
		console.log('connected users', connectedUsers)
	});
}
ZPe7m3L0RrwmWuISAAAC
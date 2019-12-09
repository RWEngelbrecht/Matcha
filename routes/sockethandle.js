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

		socket.on('join_chat', (data) => {
			socket.join(data.chatID)
		});

		socket.on('new_message', (data) => {
			var from, to;
			var message = data.message;
			var chatID = data.chatID;
			console.log(chatID);
			// show messagers
			connectedUsers.forEach(con => {
				if (con.user == data.chatFrom) {
					from = con.id;
				}
				if (con.user == data.chatTo) {
					to = con.id;
				}
			});
			// socket.emit('new_message', {message : message, username: socket.username});
			// io.sockets.to(to).emit('new_message', {message : message, username: socket.username});
			// io.sockets.to(toSocketID).emit('new_notification', {message : 'You have a new message from', user : from});
			var newMessage = new Message({
				chatID: chatID,
				sentBy: data.chatFrom,
				sentTo: data.chatTo,
				message: message
			});
			newMessage.save().then(() => console.log('message saved to db'));
		});

			// socket.on('disconnect', () => {
			// 	for(let i = 0; i < connectedUsers.length; i++) {
			// 		if (connectedUsers[i].id === socket.id) {
			// 			connectedUsers.splice(i, 1);
			// 		}
			// 		io.emit('exit', connectedUsers);
			// 	}
			// });
			console.log('connected users', connectedUsers)
	});
}
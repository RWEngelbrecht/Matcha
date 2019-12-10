const Message	= require("../models/messages.js");
const User= require("../models/umod.js");
const io = require('../app.js');
var chatRooms = [];


module.exports = function(connectedUsers) {

	io.on('connection', (socket) => {
		var user = {};

		// adds email and socket id to connectedUsers arr on login
		socket.on('login', (data) => {
			User.findOne({email: data.email}, function(err, doc) {
				if (doc) {
					user.user = doc.username;
					user.id = socket.id;
					connectedUsers.push(user);
					chatRooms = doc.chatRooms;
				} else {
					console.error(err);
				}
			});
		})

		socket.on('new_message', (data) => {
			console.log(data);
			// var message = data.message;
			// var chatID = data.chatID;
			var fromID;
			connectedUsers.forEach(con => {
				if (con.user == data.chatFrom) {
					fromID = con.id;
			// 		fromName = con.user;
				}
			// 	if (con.user == data.chatTo) {
			// 		toID = con.id;
			// 		toName = con.user;
			});
			console.log(fromID);
			// });
			// connectedUsers.forEach(user => {
			// 	if (user.id === toID) {
			// 		socket.join(chatID);
			// 		io.sockets.to(chatID).emit('new_message', {message: message, username: 1});
			// 	}
				// if (user.id === fromID) {
				// 	socket.join(chatID);
				// 	io.sockets.to(chatID).emit('new_message', {message: message, username: 2});
				// }
			// })
			// console.log('chatID: ',chatID)
			// socket.join(chatID);
			// io.sockets.in(io.sockets.adapter.rooms.chatID).emit('new message', {message: message, username: 1 });
			// io.sockets.to(chatID).emit('new_message', {message: message, username: 1});
			socket.to(fromID).emit('new_message', {message : "message", username: "username"});
			// var newMessage = new Message({
			// 	chatID: chatID,
			// 	sentBy: data.chatFrom,
			// 	sentTo: data.chatTo,
			// 	message: message
			// });
			// newMessage.save().then(() => console.log('message saved to db'));
			console.log('connected users', connectedUsers)
		});
	});
}

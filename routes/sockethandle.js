const io        = require("../app.js");
const Message	= require("../models/messages.js");
module.exports = function(server) {
	io.on('connection', (socket) => {
		// adds email and socket id to connectedUsers arr on login
		socket.on('login', (data) => {
			var user = {};
			console.log("new user connected");
			user.user = data.email
			user.id = socket.id
			connectedUsers.push(user);
			console.log('1', connectedUsers);
		});
		console.log('2', connectedUsers);
		socket.on('join_chat', (data) => {
			socket.join(data.chatID)
		});

		socket.on('new_message', (data) => {
			var message = data.message;
			var chatID = data.chatID;
			console.log(chatID);
			// show message
			connectedUsers.forEach(con => {
				if (con.email == data.chatTo) {
					toSocketID = con.id;
					console.log("toSocketID");
				}
			});
			io.sockets.to(chatID).emit('new_message', {message : message, username: socket.username});
			// io.sockets.to(toSocketID).emit('new_notification', {message : 'You have a new message from', user : from});
			var newMessage = new Message({
				chatID: chatID,
				sentBy: data.chatFrom,
				sentTo: data.chatTo,
				message: message
			});
			newMessage.save().then(() => console.log('message saved to db'));
		});

		socket.on('disconnect', () => {
			for(let i = 0; i < connectedUsers.length; i++) {
				if (connectedUsers[i].id === socket.id) {
					connectedUsers.splice(i, 1);
				}
				io.emit('exit', connectedUsers);
			}
		});
	});
}
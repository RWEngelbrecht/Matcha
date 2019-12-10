const Message	= require("../models/messages.js");
const User= require("../models/umod.js");
const io = require('../app.js');
var chatRooms = [];


module.exports = function(connectedUsers) {

	io.on('connection', (socket) => {
		var user = {};


		if (chatRooms.length > 0) {
			chatRooms.forEach(room => {
				socket.join(room);
				console.log('room joined: ', room);
			});
		}
		// console.log(socket.rooms);
		// adds email and socket id to connectedUsers arr on login
		socket.on('login', (data) => {
			User.findOne({email: data.email}, function(err, doc) {
				if (doc) {
					user.user = doc.username;
					user.id = socket.id;
					connectedUsers.push(user);
					chatRooms = doc.chatRooms;
					console.log('CHATROOMS AT LOGIN:  ',doc.chatRooms);
					console.log('GLOBAL VARIABLE CHATROOMS: ',chatRooms);
				} else {
					console.error(err);
				}
			});
		})

		socket.on('like', data => {
			User.findOne({username: data.liker}, (err, doc) => {
				to_update = doc.chatRooms;
				console.log("TO UPDATE 1", to_update);
				to_update.push(data.chatID);
				console.log("TO UPDATE 2", to_update);
				// console.log("DOC", doc);
				User.findOneAndUpdate({username: data.liker}, {$set: {chatRooms: to_update}}, {new:true}, (err, docs) => {
					// console.log("DOCS YES DOCS", docs);
					console.log('UPDATED CHATROOMS ON LIKE: ', docs.chatRooms);
					// console.log("PRE FINAL: ", chatRooms);
				})
				chatRooms = to_update;
			})
			// console.log('FINAL : ',chatRooms);
		})

	// 	socket.on('join_chat', function (data) {
	// 		socket.join(data.chatID)
	// 		console.log('data.chatID:', data.chatID);
	// // console.log('socket rooms', io.sockets.adapter.rooms);
	// 	});

		socket.on('new_message', (data) => {
			var fromID, toID, fromName, toName;
			var message = data.message;
			var chatID = data.chatID;

			connectedUsers.forEach(con => {
				if (con.user == data.chatFrom) {
					fromID = con.id;
					fromName = con.user;
				}
				if (con.user == data.chatTo) {
					toID = con.id;
					toName = con.user;
				}
			});
			// console.log('chatID: ',chatID)
			// socket.join(chatID);
	// chat should have a message from 1 if sending to specific room works
	// 2 is just to make sure it is sending in general
			// io.sockets.in(io.sockets.adapter.rooms.chatID).emit('new message', {message: message, username: 1 });
			io.sockets.to(chatID).emit('new_message', {message: message, username: fromName});
			// io.sockets.emit('new_message', {message : message, username: 2});
			var newMessage = new Message({
				chatID: chatID,
				sentBy: data.chatFrom,
				sentTo: data.chatTo,
				message: message
			});
			newMessage.save().then(() => console.log('message saved to db'));
		});
		// console.log('connected users', connectedUsers)
	});
}

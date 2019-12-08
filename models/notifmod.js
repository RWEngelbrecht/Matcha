const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationTable = new Schema({
	notifiedUser: {
		type: String
	},
	notifType: {
		type: String
	},
	notifTime: {
		type: Date,
		default: Date.now
	},
	notifBody: {
		type: String
	},
	read: {
		type: Boolean,
		default: false
	}
});

module.exports = mongoose.model('Notifications', notificationTable);
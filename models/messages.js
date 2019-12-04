const mongoose = require('mongoose');
const User = require('./umod');
const Schema = mongoose.Schema;

const messagetable = new Schema({
	sentBy: {
		type: String,
		required: true
	},
	sentTo: {
		type: String,
		required: true
	},
	time: {
		type: Date,
		default: Date.now
    },
    message: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: 0,
    }
});

module.exports = mongoose.model('Message', messagetable);
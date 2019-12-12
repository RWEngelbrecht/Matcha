const mongoose = require('mongoose');
const User = require('./umod');
const Schema = mongoose.Schema;

const liketable = new Schema({
	likeBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: false
	},
	likedUser: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: false
	},
	liker: {
		type: String,
		required: false
	},
	liked: {
		type: String,
		required: false
	},
	dateLiked: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Likes', liketable);
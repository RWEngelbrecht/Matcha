const mongoose = require('mongoose');
const User = require('./umod');
const Schema = mongoose.Schema;

const liketable = new Schema({
	likeBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	likedUser: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	dateLiked: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Likes', liketable);
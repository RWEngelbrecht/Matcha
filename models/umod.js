const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const usertable = new Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	firstname: {
		type: String,
		required: true
	},
	surname: {
		type: String,
		required: true
	},
	age: {
		type: Number,
		required: true
	},
	gender: {
		type: String,
		required: true
	},
	genderpref: {
		type: String,
		required: true
	},
	photocount: {
		type: Number,
		required: true,
		default: 1,
	},
	fame: {
		type: Number,
		required: true,
		default: 0
	},
	agepreflower: {
		type: Number,
		required: true
	},
	ageprefupper: {
		type: Number,
		required: true
	},
	about: {
		type: String,
		required: true
	},
	verifkey: {
		type: String,
		required: true
	},
	verified: {
		type: Boolean,
		required: true,
		default: 0
	},
	maxdist: {
		type: Number,
		required: true,
		default: 50,
	},
	interests: [{
		type: String,
		default: null,
	}],
	lastSeen: {
		type: Date,
		default: Date.now()
	},
	loggedIn: {
		type: Boolean,
		default: false
	}
	// TODO LOCATION.
});

module.exports = mongoose.model('User', usertable);
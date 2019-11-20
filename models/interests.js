const mongoose = require('mongoose');
const User = require('./umod');
const Schema = mongoose.Schema;

const interests = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
    },
    hiking: {
        type: Boolean,
        default: 0,
        required: true,
    },
    cooking: {
        type: Boolean,
        default: 0,
        required: true,
    },
    reading: {
        type: Boolean,
        default: 0,
        required: true,
    },
    travelling: {
        type: Boolean,
        default: 0,
        required: true,
    },
    film: {
        type: Boolean,
        default: 0,
        required: true,
    },
    photography: {
        type: Boolean,
        default: 0,
        required: true,
    },
    technology: {
        type: Boolean,
        default: 0,
        required: true,
    },
    dancing: {
        type: Boolean,
        default: 0,
        required: true,
    },
    sport: {
        type: Boolean,
        default: 0,
        required: true,
    },
    politics: {
        type: Boolean,
        default: 0,
        required: true,
    },
});

module.exports = mongoose.model('Interests', interests);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const phototable = new Schema({
	photo: {
        // meh you know what this is...
		type: String,
		required: true,
    },
    photoid: {
        // please keep to verifkey+hashed (photocount of user).
        type: String,
        required: true,
    },
    user: {
        // will pass this the object_id of the person posting
        type: Schema.Types.ObjectId,
        required: true,
    },
    isprofile: {
        type: Boolean,
        default: 0,
        required: true,
    }
});

module.exports = mongoose.model('Photo', phototable);
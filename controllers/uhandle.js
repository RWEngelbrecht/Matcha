const User	= require('../models/umod');
const path	= require('path');

exports.login = (req, res, next) => {
	console.log("uhandle reached(Controller)");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	console.log(path.resolve('views/login.html'));
	res.sendfile(path.resolve('views/login.html'));
}
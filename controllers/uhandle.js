const User	= require('../models/umod');
const path	= require('path');

exports.home = (req, res, next) => {
	console.log("uhandle home reached(Controller)");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.sendfile(path.resolve('views/index.html'));
}

exports.login = (req, res, next) => {
	console.log("uhandle login reached(Controller)");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.sendfile(path.resolve('views/login.html'));
}

exports.register = (req, res, next) => {
	console.log("uhandle register reached(Controller)");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.sendfile(path.resolve('views/register.html'));
}
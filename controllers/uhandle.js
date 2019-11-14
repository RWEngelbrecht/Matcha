const User	= require('../models/umod');
const path	= require('path');
const swig	= require('../app.js');

exports.home = (req, res, next) => {
	console.log("uhandle home reached(Controller)");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	if (!req.session.user_vkey) {
		console.log("should get here, no session yet");
		req.session.user_vkey = "0";
		return (res.redirect('/login'));
	} if (req.session.user_vkey == 0) {
		return (res.redirect('/login'));
	}
	return (res.render(path.resolve('views/index')));
}

exports.login = (req, res, next) => {
	console.log("uhandle login reached(Controller)");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	if (req.session.user_vkey != 0) {
		console.log("should not get here, user_vkey cookie is 0");
		// TODO, Need to take to home page or to my account page
		// return (res.redirect('/login'));
	}
	return (res.render(path.resolve('views/login')));
}

exports.register = (req, res, next) => {
	console.log("uhandle register reached(Controller)");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	return (res.render(path.resolve('views/register')));
}
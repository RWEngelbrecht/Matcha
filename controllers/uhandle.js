const User	= require('../models/umod');
const path	= require('path');
const swig	= require('../app.js');
const { validationResult } = require("express-validator");

// Home
exports.gethome = (req, res, next) => {
	console.log("uhandle home reached(Controller)");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	return (res.render(path.resolve('views/index')));
}
// Login
// GET method
exports.getlogin = (req, res, next) => {
	console.log("uhandle getlogin reached(Controller)");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	return (res.render(path.resolve('views/login')));
}
// POST method
exports.postlogin = (req, res, next) => {
	console.log("uhandle postlogin reached(Controller)");
	console.log(req.body.email);
	console.log(req.body.password);
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	// NEED TO ADD DB QUERY AND SESSION SET HERE.
}
// Register
// GET method
exports.getregister = (req, res, next) => {
	console.log("uhandle getregister reached(Controller)");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	return (res.render(path.resolve('views/register')));
}
// POST method
exports.postregister = (req, res, next) => {
	console.log("uhandle postregister reached(Controller)");
	console.log(req.body.email);
	console.log(req.body.password);
	console.log(req.body.confirm_password);
	console.log(req.body.username);
	console.log(req.body.firstname);
	console.log(req.body.surname);
	console.log(req.body.age);
	console.log(req.body.gender);
	console.log(req.body.gender_pref);
	console.log(req.body.dist);
	console.log(req.body.about);
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	// Do checks like passwords must match, encryot the passwords, send email.
	const user = new User({
		username: req.body.username,
		password: req.body.password,
		email: req.body.email,
		firstname: req.body.firstname,
		surname: req.body.surname,
		age: req.body.age,
		gender: req.body.gender,
		genderpref: req.body.gender_pref,
		// photocount: 0,
		// fame: 0,
		// agepreflower: 18,
		// agepreflower: 99,
		about: req.body.about,
		// verifkey: 'abcdefg',
		// verified: 0,
		maxdist: req.body.dist,
		// interests: 'test',
	});
	user.save().then(item => {
		res.send("item saved to database");
	}).catch(err => {
		res.status(400).send("unable to save to database");
	});
	console.log("HERE");
	// return (res.redirect('/login'));
}
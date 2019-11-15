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
		agepreflower: req.body.age - 5,
		ageprefupper: parseInt(req.body.age) + 10,
		about: req.body.about,
		// verifkey: 'abcdefg',
		maxdist: req.body.dist
		// interests: 'test',
	});
	user.save().then(item => {
		console.log("User registration Successful")
		return (res.redirect('/login'));
	}).catch(err => {
		res.status(400).send(err);
	});
	console.log("HERE");
	// return (res.redirect('/login'));
}
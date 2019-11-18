const User	= require('../models/umod');
const path	= require('path');
const swig	= require('../app.js');
const crypto = require('crypto');
const PasswordValidator = require('password-validator');
const nodemailer = require('nodemailer');
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
	var hashpw = crypto.createHash('whirlpool').update(req.body.password).digest('hex');
	User.findOne({email: req.body.email, password: hashpw}, (err, user) => {
		if (err) {
			console.log(res.status(400).send(err));
		}
		else if (user && user.verified == true) {
			console.log('Login Success!');
			return res.redirect('/');
		} else {
			console.log('Invalid login');
			return res.redirect('/login');
		}
	});
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
	var vkey = crypto.createHash('whirlpool').update(req.body.username).digest('hex');
	if (req.body.password != req.body.confirm_password) {
		// DISPLAY ERROR MESSAGE.
		console.log("Passwords do not match");
		return (res.redirect('/register'));
		// TODO send email.
	} else {
		// checks for password strength.
		var pwcheck = new PasswordValidator();
		pwcheck
		.is().min(8)
		.is().max(20)
		.has().uppercase()
		.has().lowercase()
		.has().digits()
		.has().not().spaces()  //lol
		if (pwcheck.validate(req.body.password) == 0) {
			console.log("Password must contain upper, lowercase characters and at least one digit");
			return (res.redirect('/register'));
		}
		// MAYBE DO SOME CHECKS BECUASE THIS ONLY WORKS WITH GMAIL ACCOUNTS
		var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
			  user: "wethinkcodematcha@gmail.com",
			  pass: "Matcha1matcha"
			}
		});
		var mailOptions = {
			from: 'wethinkcodematcha@gmail.com',
			to: req.body.email,
			subject: 'Confirm Your matcha account',
			html: `
        	  <h1>You successfully signed up!</h1>
        	  <p>Click this <a href="http://localhost:8000/confirm?key=${vkey}">link</a> to confirm your account.</p>
        	`
		};
		transporter.sendMail(mailOptions, function(error, info){
			if (error) {
			  console.log(error);
			} else {
			  console.log('Email sent: ' + info.response);
			}
		});
		var hashedpw = crypto.createHash('whirlpool').update(req.body.password).digest('hex');
		const user = new User({
			username: req.body.username,
			password: hashedpw,
			email: req.body.email,
			firstname: req.body.firstname,
			surname: req.body.surname,
			age: req.body.age,
			gender: req.body.gender,
			genderpref: req.body.gender_pref,
			profilephoto: req.file.buffer.toString('base64'),
			agepreflower: req.body.age - 5,
			ageprefupper: parseInt(req.body.age) + 10,
			about: req.body.about,
			verifkey: vkey,
			maxdist: req.body.dist,
			// interests: 'test',
		});
		// query schema to see if username or email exists
		User.findOne({$or: [ {username: user.username}, {email: user.email} ]}, (err, docs) => {
			console.log(docs);
			if (docs != null) {
				console.log("Invalid username or password.");
				return (res.redirect('/register'));
			} else {
				user.save().then(item => {
					console.log("User registration Successful")
					return (res.redirect('/login'));
				}).catch(err => {
					console.log(res.status(400).send(err));
					return (res.redirect('/'));
				});
			}
		});
	}
}
// Confirm Account.
// GET method
exports.getconfirm = (req, res, next) => {
	var key = req.query.key;
	User.findOneAndUpdate({verifkey: key}, {$set:{verified:"1"}},function(err, doc){
		if(err){
			console.log("Something wrong when updating data!");
		}
		console.log(doc);
	});
	// Doesnt have to go to home, should probably set user logged in or out and take to login or my account
	return (res.redirect('/'));
}
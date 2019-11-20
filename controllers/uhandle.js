const User	= require('../models/umod');
const Photo	= require('../models/photos');
const path	= require('path');
const swig	= require('../app.js');
const crypto = require('crypto');
const PasswordValidator = require('password-validator');
const nodemailer = require('nodemailer');
const { validationResult } = require("express-validator");
var sessionData;
var logged;

// Home
exports.gethome = (req, res, next) => {
	console.log("uhandle home reached(Controller)");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	if (!req.session.user) {
		logged = false;
		return (res.redirect('/login'));
	} else {
		logged = true;
	}
	if (req.session.user === 0) {
		return (res.redirect('/login'));
	}
	loggedUser = req.session.user.username 
	return (res.render(path.resolve('views/index'),{
		user: loggedUser
	}));
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
	loggedUser = 0;
	return (res.render(path.resolve('views/login'),{
		user: loggedUser
	}));
}
// POST method
exports.postlogin = (req, res, next) => {
	console.log("uhandle postlogin reached(Controller)");
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
			User.findOneAndUpdate({_id: user._id}, {$set: {loggedIn: true}}, err => {
				if (err){
					console.log('Something went wrong while updating logged in status!');
				}
			});
			sessionData = req.session;
			sessionData.user = user;
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
	loggedUser = 0;
	return (res.render(path.resolve('views/register'),{
		user: loggedUser
	}));
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
			gender: req.body.gender.toLowerCase(),
			genderpref: req.body.gender_pref.toLowerCase(),
			agepreflower: req.body.age - 5,
			ageprefupper: parseInt(req.body.age) + 10,
			about: req.body.about,
			verifkey: vkey,
			maxdist: req.body.dist,
			interests: req.body.interests
		});
		// query schema to see if username or email exists
		User.findOne({$or: [ {username: user.username}, {email: user.email} ]}, (err, docs) => {
			if (docs != null) {
				console.log("Invalid username or password.");
				return (res.redirect('/register'));
			} else {
				user.save().then(item => {
					id_to_user = item._id;
					date = Date.now();
					const new_photo = new Photo({
						photo: req.file.buffer.toString('base64'),
						photoid: date,
						user: id_to_user,
						isprofile: 1,
					});
					new_photo.save().then(item => {
						console.log("Profile Photo Addition Successful");
						return (res.redirect('/'));
					}).catch(err => {
						console.log(res.status(400).send(err));
						return (res.redirect('/'));
					});
					console.log("User registration Successful")
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
	req.session.user = key;
	console.log(req.session.user);
	// Doesnt have to go to home, should probably set user logged in or out and take to login or my account
	return (res.redirect('/'));
}
// Logout
// GET method. Doesnt really matter get, post, all.
exports.getlogout = (req, res, next) => {
	User.findOneAndUpdate({_id: req.session.user._id}, {$set: {lastSeen: Date.now(), loggedIn: false}}, err => {
		if (err) {
			console.log("Something went wrong while logging out!");
		}
	})
	req.session.user = 0;
	return (res.redirect('/'));
}
// Send Reset Password Link
// GET method
exports.getresetpwd = (req, res, next) => {
	return (res.render(path.resolve('views/send_reset_password')));
}
// POST method
exports.postresetpwd = (req, res, next) => {
	console.log("uhandle postresetpwd reached(Controller)");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	User.findOne({email: req.body.resetpwd_email}, (err, user) => {
		if (err) {
			console.log(res.status(400).send(err));
			return res.redirect('/login');
		} else if (user != null) {		
			var transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: "wethinkcodematcha@gmail.com",
					pass: "Matcha1matcha"
				}
			});
			var mailOptions = {
				from: 'wethinkcodematcha@gmail.com',
				to: req.body.resetpwd_email,
				subject: 'Reset your matcha account password',
				html: `
				<h1>Reset Your Matcha Password</h1>
				<p>Click this <a href="http://localhost:8000/resetpassword">link</a> to reset you password.</p>
				`
			};
			transporter.sendMail(mailOptions, function(error, info){
				if (error) {
					console.log(error);
				} else {
					console.log('Email sent: ' + info.response);
				}
			});
			// FLASH MESSAGE TO CHECK EMAIL.
			return res.redirect('/login');
		} 
		else {
			console.log('Invalid email');
			return res.redirect('/login');
		}
	});
}
// ACTUALLY RESET THE PASSWORD
// GET method
exports.getresetpassword = (req, res, next) => {
	console.log("uhandle getresetpassword reached(Controller)");
	return (res.render(path.resolve('views/reset_password')));
}
// POST method
exports.postresetpassword = (req, res, next) => {
	console.log("uhandle postresetpassword reached(Controller)");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	User.findOne({email: req.body.confirm_email}, (err, user) => {
		if (err) {
			console.log(res.status(400).send(err));
			return res.redirect('/login');
		} if (user != null) {
			if (req.body.new_pass_forgot != req.body.confirm_new_pass_forgot) {
				console.log("Passwords do not match");
				return res.redirect('/login');
			} else {
				var pwcheck = new PasswordValidator();
				pwcheck
				.is().min(8)
				.is().max(20)
				.has().uppercase()
				.has().lowercase()
				.has().digits()
				.has().not().spaces()  //lol
				if (pwcheck.validate(req.body.new_pass_forgot) == 0) {
					console.log("Password must contain upper, lowercase characters and at least one digit");
					return (res.redirect('/register'));
				}
				var forgothashedpw = crypto.createHash('whirlpool').update(req.body.new_pass_forgot).digest('hex');
				User.findOneAndUpdate({email: req.body.confirm_email}, {$set:{password: forgothashedpw}},function(err, doc){
					if(err){
						console.log("Something wrong when updating data!");
					}
					console.log("Password updated successfully");
					// loggin the user out.
					req.session.user = 0;
					return (res.redirect('/'));
				});
			}
		}
	});
}
//test to see how session works
exports.getUserData = (req, res, next) => {
	console.log('Reached getUserData');
	sessionData = req.session;
	console.log(sessionData.user.interests);
	return (res.render(path.resolve('views/index')));
}


const User	= require('../models/umod');
const path	= require('path');
const swig	= require('../app.js');
const Validate	= require('./validate.class');
const crypto = require('crypto');
const PasswordValidator = require('password-validator');
const nodemailer = require('nodemailer');
const { validationResult } = require("express-validator");

// Landing page for updating user information.
exports.updateinfo = (req, res, next) => {
	console.log("updateinfo controller reached reached");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	loggedUser = req.session.user.username
	return (res.render(path.resolve('views/update_info'),{
		user: loggedUser
	}));
}
// GET username (updates)
exports.getusername = (req, res, next) => {
	console.log("getusername controller reached reached");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	return (res.render(path.resolve('views/update_username')));
}
// POST username (updates)
exports.postusername = (req, res, next) => {
	console.log("postusername controller reached reached");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	var validate = new Validate();
	var check = validate.ValidateUsername(req.body.new_username);
	if (check == 0) {
		console.log("USERNAME CHECK WORKING HERE(UPDATE USERNAME)")
		return(res.redirect('/updateinfo'));
	}
	key = req.session.user.verifkey;
    User.findOneAndUpdate({verifkey: key}, {$set:{username:req.body.new_username}}, {new: true}, function(err, doc){
		if(err){
			console.log("Something wrong when updating data!");
		}
		req.session.user = doc;
	});
	req.session.user.username = req.body.new_username;
	return (res.redirect('/updateinfo'));
}
// GET name & surname
exports.getname = (req, res, next) => {
    console.log("getname controller reached reached");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	return (res.render(path.resolve('views/update_name')));
}
// POST name & surname
exports.postname = (req, res, next) => {
    console.log("postname controller reached reached");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	var validate = new Validate();
	var checkfname = validate.isAlpha(req.body.new_firstname);
	var checksurname = validate.isAlpha(req.body.new_surname);
	if (checkfname == 0 || checksurname == 0) {
		console.log("NAME & SURNAME CHECK WORKING HERE(UPDATE NAME)")
		return(res.redirect('/updateinfo'));
	}
    key = req.session.user.verifkey;
    User.findOneAndUpdate({verifkey: key}, {$set:{firstname:req.body.new_firstname, surname:req.body.new_surname}}, {new: true},function(err, doc){
		if(err){
			console.log("Something wrong when updating data!");
		}
		console.log("Name & Surname updated successfully");
	});
	req.session.user.firstname = req.body.new_firstname;
	req.session.user.surname = req.body.new_surname;
	return (res.redirect('/updateinfo'));
}
// GET age, and age pref.
exports.getage = (req, res, next) => {
    console.log("getage controller reached reached");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	return (res.render(path.resolve('views/update_age')));
}
// POST age, and age pref.
exports.postage = (req, res, next) => {
    console.log("postage controller reached reached");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	var validate = new Validate();
	var checkage = validate.isNumeric(req.body.new_age);
	var checkageprefupper = validate.isNumeric(req.body.new_ageupper);
	var checkagepreflower = validate.isNumeric(req.body.new_agelower);
	if (checkage == 0 || checkagepreflower == 0 || checkageprefupper == 0) {
		console.log("AGE CHECK WORKING HERE(UPDATE AGE)")
		return(res.redirect('/updateinfo'));
	}
    key = req.session.user.verifkey;
    User.findOneAndUpdate({verifkey: key}, {$set:{age:req.body.new_age, agepreflower:req.body.new_agelower, ageprefupper:req.body.new_ageupper}}, {new: true},function(err, doc){
		if(err){
			console.log("Something wrong when updating data!");
		}
		console.log("Age & Preferences updated successfully");
	});
	req.session.user.age = req.body.new_age;
	console.log(req.session.user.age);
	req.session.user.agepreflower = req.body.new_agelower;
	console.log(req.session.user.agepreflower);
	req.session.user.ageprefupper = req.body.new_ageupper;
	console.log(req.session.user.ageprefupper);
	return (res.redirect('/updateinfo'));
}
// GET maxdist
exports.getmaxdist = (req, res, next) => {
    console.log("getmaxdist controller reached reached");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	return (res.render(path.resolve('views/update_maxdist')));
}
// POST maxdist
exports.postmaxdist = (req, res, next) => {
    console.log("postmaxdist controller reached reached");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
    }
    key = req.session.user.verifkey;
    User.findOneAndUpdate({verifkey: key}, {$set:{maxdist:req.body.new_maxdist}}, {new: true},function(err, doc){
		if(err){
			console.log("Something wrong when updating data!");
		}
		console.log("Maximum Distance updated successfully");
	});
	req.session.user.maxdist = req.body.new_maxdist;
	console.log(req.session.user.maxdist);
	return (res.redirect('/updateinfo'));
}
// GET email
exports.getemail = (req, res, next) => {
    console.log("getemail controller reached reached");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	return (res.render(path.resolve('views/update_email')));
}
// POST email
exports.postemail = (req, res, next) => {
    console.log("postemail controller reached reached");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	var validate = new Validate();
	var check = validate.isEmail(req.body.new_email);
	if (check == 0) {
		console.log("EMAIL CHECK WORKING HERE(UPDATE EMAIL)")
		return(res.redirect('/updateinfo'));
	}
    key = req.session.user.verifkey;
    User.findOneAndUpdate({verifkey: key}, {$set:{verified:0}}, {new: true},function(err, doc){
		if(err){
			console.log("Something wrong when updating data!");
		}
		console.log("No longer Verified");
	});
	User.findOneAndUpdate({verifkey: key}, {$set:{email:req.body.new_email}}, {new: true},function(err, doc){
		if(err){
			console.log("Something wrong when updating data!");
		}
		console.log("Email Updated Successfully");
	});
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: "wethinkcodematcha@gmail.com",
			pass: "Matcha1matcha"
		}
	});
	var mailOptions = {
		from: 'wethinkcodematcha@gmail.com',
		to: req.body.new_email,
		subject: 'Confirm Your new email',
		html: `
		<h1>Click here to verify your new email!</h1>
		<p>Click this <a href="http://localhost:8000/confirm?key=${key}">link</a> to confirm your account.</p>
		`
	};
	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
	req.session.user.email = req.body.new_email;
	return (res.redirect('/updateinfo'));
}
// GET password
exports.getpassword = (req, res, next) => {
    console.log("getpassword controller reached reached");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	return (res.render(path.resolve('views/update_password')));
}
// POST password
exports.postpassword = (req, res, next) => {
    console.log("postpassword controller reached reached");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	// checks for password strength.
	var validate = new Validate();
	var check = validate.ValidatePassword(req.body.new_password);
	if (check == 0) {
		console.log("PASSWORD CHECK WORKING HERE(UPDATE PASSWORD)")
		return(res.redirect('/updateinfo'));
	}
	if (req.body.new_password === req.body.confirm_new_password) {
		console.log("Passwords Match");
		hashpw = crypto.createHash('whirlpool').update(req.body.old_password).digest('hex');
		newhashpw = crypto.createHash('whirlpool').update(req.body.new_password).digest('hex');
		key = req.session.user.verifkey;
		User.findOneAndUpdate({verifkey: key, password: hashpw}, {$set:{password: newhashpw}}, {new: true},function(err, doc){
			if(err){
				console.log("Something wrong when updating data!");
			}
			console.log("Password updated successfully");
			// loggin the user out.
			req.session.user = 0;
		});
	}
	return (res.redirect('/updateinfo'));
}
// GET about
exports.getabout = (req, res, next) => {
    console.log("getabout controller reached reached");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	return (res.render(path.resolve('views/update_about')));
}
// POST about
exports.postabout = (req, res, next) => {
	console.log("postabout controller reached reached");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	var validate = new Validate();
	var check = validate.isAlphanumeric(req.body.new_about);
	if (check == 0) {
		console.log("ABOUT CHECK WORKING HERE(UPDATE ABOUT)")
		return(res.redirect('/updateinfo'));
	}
	key = req.session.user.verifkey;
	User.findOneAndUpdate({verifkey: key}, {$set:{about:req.body.new_about}}, {new: true},function(err, doc){
		if(err){
			console.log("Something wrong when updating data!");
		}
		console.log("Maximum Distance updated successfully");
	});
	req.session.user.about = req.body.new_about;
	console.log(req.session.user.about);
	return (res.redirect('/updateinfo'));
}
// GET location
exports.getlocation = (req, res, next) => {
    console.log("getlocation controller reached reached");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	return (res.render(path.resolve('views/update_location')));
}
// POST location
exports.postlocation = (req, res, next) => {
	console.log("postabout controller reached reached");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	key = req.session.user.verifkey;
	var new_loc = [req.body.new_postal, req.body.new_city, req.body.new_province];
	User.findOneAndUpdate({verifkey: key}, {$set:{location:new_loc}}, {new: true},function(err, doc){
		if(err){
			console.log("Something wrong when updating data!");
		}
		console.log("Location updated successfully");
	});
	req.session.user.location = new_loc;
	return (res.redirect('/updateinfo'));
}
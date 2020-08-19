const User	= require('../models/umod');
const path	= require('path');
const swig	= require('../app.js');
const Validate	= require('./validate.class');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const knex = require('../database');

// Landing page for updating user information.
exports.updateinfo = (req, res, next) => {
	console.log("updateinfo controller reached reached");
	loggedUser = req.session.user.username
	return (res.render(path.resolve('views/update_info'),{
		user: loggedUser
	}));
}
// GET username (updates)
exports.getusername = (req, res, next) => {
	console.log("getusername controller reached reached");
	return (res.render(path.resolve('views/update_username')));
}
// POST username (updates)
exports.postusername = (req, res, next) => {
	console.log("postusername controller reached reached");
	var validate = new Validate();
	var check = validate.ValidateUsername(req.body.new_username);
	if (check == 0) {
		req.flash('error_msg', 'Username cannot contain special characters and must be at least 5 characters long');
		return(res.redirect('/updateinfo'));
	}
	key = req.session.user.verifkey;
	knex('user')
  		.where({verifkey: key})
		.update({ username:req.body.new_username})
		.then(()=> {
			req.session.user.username = req.body.new_username;
			return (res.redirect('/updateinfo'));
		})
}
// GET name & surname
exports.getname = (req, res, next) => {
    console.log("getname controller reached reached");
	return (res.render(path.resolve('views/update_name')));
}
// POST name & surname
exports.postname = (req, res, next) => {
    console.log("postname controller reached reached");
	var validate = new Validate();
	var checkfname = validate.isAlpha(req.body.new_firstname);
	var checksurname = validate.isAlpha(req.body.new_surname);
	if (checkfname == 0 || checksurname == 0) {
		req.flash('error_msg', 'No special characters or numbers allowed');
		return(res.redirect('/updateinfo'));
	}
	key = req.session.user.verifkey;
	knex('user')
  		.where({verifkey: key})
		.update({ firstname:req.body.new_firstname, surname:req.body.new_surname })
		.then(()=> {
			req.session.user.firstname = req.body.new_firstname;
			req.session.user.surname = req.body.new_surname;
			return (res.redirect('/updateinfo'));
		})
}
// GET age, and age pref.
exports.getage = (req, res, next) => {
    console.log("getage controller reached reached");
	return (res.render(path.resolve('views/update_age')));
}
// POST age, and age pref.
exports.postage = (req, res, next) => {
    console.log("postage controller reached reached");
	var validate = new Validate();
	var checkage = validate.isNumeric(req.body.new_age);
	var checkageprefupper = validate.isNumeric(req.body.new_ageupper);
	var checkagepreflower = validate.isNumeric(req.body.new_agelower);
	if (checkage == 0 || checkagepreflower == 0 || checkageprefupper == 0) {
		req.flash('error_msg', 'only numbers please');
		return(res.redirect('/updateinfo'));
	}
	key = req.session.user.verifkey;
	knex('user')
  		.where({verifkey: key})
		.update({ age:req.body.new_age, agepreflower:req.body.new_agelower, ageprefupper:req.body.new_ageupper })
		.then(()=> {
			req.session.user.age = req.body.new_age;
			req.session.user.agepreflower = req.body.new_agelower;
			req.session.user.ageprefupper = req.body.new_ageupper;
			return (res.redirect('/updateinfo'));
		})
}
// GET maxdist
exports.getmaxdist = (req, res, next) => {
    console.log("getmaxdist controller reached reached");
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
	knex('user')
  		.where({verifkey: key})
		.update({ maxdist:req.body.new_maxdist })
		.then(()=> {
			req.session.user.maxdist = req.body.new_maxdist;
			return (res.redirect('/updateinfo'));
		})
}
// GET email
exports.getemail = (req, res, next) => {
    console.log("getemail controller reached reached");
	return (res.render(path.resolve('views/update_email')));
}
// POST email
exports.postemail = (req, res, next) => {
    console.log("postemail controller reached reached");
	var validate = new Validate();
	var check = validate.isEmail(req.body.new_email);
	if (check == 0) {
		req.flash('error_msg', 'Invalid Email');
		return(res.redirect('/updateinfo'));
	}
	key = req.session.user.verifkey;
	knex('user')
  		.where({verifkey: key})
		.update({ verified:0 })
		.then(()=> {
			knex('user')
  			.where({verifkey: key})
			.update({ email:req.body.new_email})
			.then(()=> {
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
			})
		})
}
// GET password
exports.getpassword = (req, res, next) => {
    console.log("getpassword controller reached reached");
	return (res.render(path.resolve('views/update_password')));
}
// POST password
exports.postpassword = (req, res, next) => {
    console.log("postpassword controller reached reached");
	// checks for password strength.
	var validate = new Validate();
	var check = validate.ValidatePassword(req.body.new_password);
	if (check == 0) {
		req.flash('error_msg', 'Password must conatin at least one Uppercase letter and a number and no special characters');
		return(res.redirect('/updateinfo'));
	}
	if (req.body.new_password === req.body.confirm_new_password) {
		console.log("Passwords Match");
		hashpw = crypto.createHash('whirlpool').update(req.body.old_password).digest('hex');
		newhashpw = crypto.createHash('whirlpool').update(req.body.new_password).digest('hex');
		key = req.session.user.verifkey;
		knex('user')
  		.where({verifkey: key, password: hashpw})
		.update({ password: newhashpw})
		.then(()=> {
			req.session.user = 0;
		})
	}
	else {
		req.flash('error_msg', 'Passwords do not match');
		return(res.redirect('/updateinfo'));
	}
	return (res.redirect('/updateinfo'));
}
// GET about
exports.getabout = (req, res, next) => {
    console.log("getabout controller reached reached");
	return (res.render(path.resolve('views/update_about')));
}
// POST about
exports.postabout = (req, res, next) => {
	key = req.session.user.verifkey;
	knex('user')
  		.where({verifkey: key})
		.update({ about:req.body.new_about})
		.then(()=> {
			req.session.user.about = req.body.new_about;
			return (res.redirect('/updateinfo'));
		})
}
// GET location
exports.getlocation = (req, res, next) => {
	return (res.render(path.resolve('views/update_location')));
}
// POST location
exports.postlocation = (req, res, next) => {
	key = req.session.user.verifkey;
	var new_loc = [req.body.new_postal, req.body.new_city, req.body.new_province];
	knex('user')
  		.where({verifkey: key})
		.update({ location:new_loc})
		.then(()=> {
			req.session.user.location = new_loc;
			return (res.redirect('/updateinfo'));
		})
}
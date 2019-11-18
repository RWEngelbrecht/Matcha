const User	= require('../models/umod');
const path	= require('path');
const swig	= require('../app.js');
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
	return (res.render(path.resolve('views/update_info')));
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
    key = req.session.user.verifkey;
    User.findOneAndUpdate({verifkey: key}, {$set:{username:req.body.new_username}},function(err, doc){
		if(err){
			console.log("Something wrong when updating data!");
		}
		console.log("username updated successfully");
	});
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
    key = req.session.user.verifkey;
    User.findOneAndUpdate({verifkey: key}, {$set:{firstname:req.body.new_firstname, surname:req.body.new_surname}},function(err, doc){
		if(err){
			console.log("Something wrong when updating data!");
		}
		console.log("Name & Surname updated successfully");
	});
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
    key = req.session.user.verifkey;
    User.findOneAndUpdate({verifkey: key}, {$set:{age:req.body.new_age, agepreflower:req.body.new_agelower, ageprefupper:req.body.new_ageupper}},function(err, doc){
		if(err){
			console.log("Something wrong when updating data!");
		}
		console.log("Age & Preferences updated successfully");
	});
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
    User.findOneAndUpdate({verifkey: key}, {$set:{maxdist:req.body.new_maxdist}},function(err, doc){
		if(err){
			console.log("Something wrong when updating data!");
		}
		console.log("Maximum Distance updated successfully");
	});
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
    key = req.session.user.verifkey;
    User.findOneAndUpdate({verifkey: key}, {$set:{verified:0}},function(err, doc){
		if(err){
			console.log("Something wrong when updating data!");
		}
		console.log("No longer Verified");
	});
	User.findOneAndUpdate({verifkey: key}, {$set:{email:req.body.new_email}},function(err, doc){
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
	return (res.redirect('/updateinfo'));
}

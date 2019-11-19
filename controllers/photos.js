const User	= require('../models/umod');
const path	= require('path');
const swig	= require('../app.js');
const crypto = require('crypto');
const PasswordValidator = require('password-validator');
const nodemailer = require('nodemailer');
const { validationResult } = require("express-validator");

exports.getphoto = (req, res, next) => {
	console.log("getphoto controller reached reached");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	return (res.render(path.resolve('views/photos')));

}
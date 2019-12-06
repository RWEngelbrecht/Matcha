const User	= require('../models/umod');
const Photo	= require('../models/photos');
const Validate	= require('./validate.class');
const path	= require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const iplocation = require("iplocation").default;
const fs = require('fs');
global.loc = [];
var all_pos_interests = [
	'Octopi / Octopuses / Octopodes',
	'Alcohol',
	'Arguing with people online',
	'Tying knots',
	'Salami',
	'Dating Apps',
	'Kicking puppies',
	'Counting from 1-10 100 times',
	'Repetitive Music',
	'Doing cartwheels',
];

// Home
exports.gethome = (req, res, next) => {
	console.log("uhandle home reached(Controller)");
	if (!req.session.user) {
		logged = false;
		return (res.redirect('/login'));
	} else {
		logged = true;
	}
	if (req.session.user === 0) {
		return (res.redirect('/login'));
	}
	if (req.session.user.interests === null) {
		return (res.redirect('/interests'));
	}
	currUser = req.session.user
	Photo.find({user: currUser._id}, (err, photos) => {
		if (err) {
			console.log("Could not find photos.");
		}
		return (res.render(path.resolve('views/index'),{user: currUser, photos: photos}));
	});
}
// Login
// GET method
exports.getlogin = (req, res, next) => {
	console.log("uhandle getlogin reached(Controller)");
	loggedUser = 0;
	return (res.render(path.resolve('views/login'),{user: loggedUser}));
}
// POST method
exports.postlogin = (req, res) => {
	console.log("uhandle postlogin reached(Controller)");
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
			req.session.user = user;
			me = getLocation(user._id);
			me.then(function(result) {
				global.loc = result;
			}).then (function (result){
				req.session.user.location = global.loc;
				return (res.redirect('/'));
			});
		} else {
			console.log('Invalid login');
			return res.redirect('/login');
		}
	});
	// NEED TO ADD DB QUERY AND SESSION SET HERE.
}
function getLocation(id) {
	return new Promise(function(resolve, reject){
		fs.readFile("IPAddresses.txt", 'utf8',function(err, data){
			if(err) throw err;
			var lines = data.split('\n');
			var ip = lines[Math.floor(Math.random()*lines.length)];
			iplocation(ip, [], (error, res) => {
				location = [
					res.postal,
					res.city,
					res.region,
				];
				User.findOneAndUpdate({_id: id}, {$set: {location: location}}, (err, user) => {
					if (err){
						console.log('failed to set location');
						reject(user);
					}
				});
				resolve(location);
			});
		});
	})
}
// Register
// GET method
exports.getregister = (req, res, next) => {
	console.log("uhandle getregister reached(Controller)");
	loggedUser = 0;
	return (res.render(path.resolve('views/register'),{
		user: loggedUser
	}));
}
// POST method
exports.postregister = (req, res, next) => {
	console.log("uhandle postregister reached(Controller)");
	var validate = new Validate();
	check_reg = validate.validateregister(req.body);
	if (check_reg == 0) {
		return (res.redirect('/register'));
	}
	var vkey = crypto.createHash('whirlpool').update(req.body.username).digest('hex');
	if (req.body.password != req.body.confirm_password) {
		// DISPLAY ERROR MESSAGE.
		console.log("Passwords do not match");
		return (res.redirect('/register'));
		// TODO send email.
	} else {
		// checks for password strength.
		var check = new Validate();
		var pwcheck = check.ValidatePassword(req.body.password);
		var unamecheck = check.ValidateUsername(req.body.username)
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

	});
	req.session.user = null;
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
			console.log('Email does not exist, piss off');
			return res.redirect('/login');
		}
	});
}
// ACTUALLY RESET THE PASSWORD
// GET method
exports.getresetpassword = (req, res, next) => {
	console.log("uhandle getresetpassword reached(Controller)");
	if (req.session.user === null || req.session.user === 0) {
		return(res.redirect('/login'));
	}
	return (res.render(path.resolve('views/reset_password')));
}
// POST method
exports.postresetpassword = (req, res, next) => {
	console.log("uhandle postresetpassword reached(Controller)");
	User.findOne({email: req.body.confirm_email}, (err, user) => {
		if (err) {
			console.log(res.status(400).send(err));
			return res.redirect('/login');
		} if (user != null) {
			if (req.body.new_pass_forgot != req.body.confirm_new_pass_forgot) {
				console.log("Passwords do not match");
				return res.redirect('/login');
			} else {
				var check = new Validate();
				var pwcheck = check.ValidatePassword(req.body.new_pass_forgot);
				if (pwcheck == 0) {
					return(res.redirect('/update_info'));
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
// INTERESTS
// GET method
exports.getinterests = (req, res, next) => {
	console.log("uhandle getinterest reached(Controller)");
	if (req.session.user === null || req.session.user === 0){
		return (res.redirect('/login'));
	};
	User.findOne({_id: req.session.user._id}, (err, user) => {
		if (err) {
			return (res.redirect('/logout'));
		}
		// console.log(user);
		interests = user.interests;
		all_interests = all_pos_interests;
		return (res.render(path.resolve('views/interests'), {interests, all_interests}));
	});
}
// POST method
exports.postinterests = (req, res, next) => {
	const { interests } = req.body;
	var currUser = req.session.user;
	currUser.interests = [];
	User.findOneAndUpdate({_id: currUser._id}, {$set: {interests: interests}}, (err, updateduser) => {
		if (err) {
			console.log("Something went wrong with updating interests.");
		}
		currUser = updateduser;
	});
	req.session.user.interests = interests;
	console.log(req.session.user.interests);
	// NEED TO FIX CURRENT USER NOT UPDATING SESSION VAR OR SOMETHING
	return (res.redirect('/'));
}

exports.getProfile = (req, res, next) => {
	currUser = req.session.user
	if (!currUser) {
		res.status(400).send(err);
	}
	var profileUsrId = req.params.id;
	if (profileUsrId != currUser._id) {
		User.findOneAndUpdate({_id: profileUsrId}, {$push: {viewedBy: currUser.username}}, (err, usr) => {
			if (err) {
				res.status(400).send(err);
			}
		});
	}
	User.findOne({_id: profileUsrId}, (err, user) => {
		if (err) {
			res.status(400).send(err);
		}
		Photo.find({user: profileUsrId}, (err, photos) => {
			if (err) {
				console.log("Could not find photos.");
			}
			res.render(path.resolve('views/index'),{user: user, photos: photos});
		});
	});
}


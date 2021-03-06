const knex = require('../database');
const Validate	= require('./validate.class');
const path	= require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const iplocation = require("iplocation").default;
const fs = require('fs');
const { type } = require('os');
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

// JUST CHECK THAT RETURNS HAPPEN IN .finally()
// Home
exports.gethome = (req, res, next) => {
	if (!req.session.user) {
		logged = false;
		return (res.redirect('/login'));
	} else {
		logged = true;
	}
	if (req.session.user === 0) {
		return (res.redirect('/login'));
	}
	currUser = req.session.user
	knex('interest')
		.where({user_id: currUser.id})
		.then((result) => {
			if (result.length == 0)
				return (res.redirect('/interests'));
			knex('photo')
				.where({user_id: currUser.id})
				.then((photos) => {
					return (res.render(path.resolve('views/index'),{user: currUser, photos: photos}));
				}).catch((err) => {
					console.log("Something went wrong! Cannot find photos!", err);
				});
		}).catch((err) => {
			console.log("Something went wrong when looking for interests!")
		});

}
// Login
// GET method
exports.getlogin = (req, res, next) => {
	loggedUser = 0;
	return (res.render(path.resolve('views/login'),{user: loggedUser}));
}
// POST method
exports.postlogin = (req, res) => {
	var hashpw = crypto.createHash('whirlpool').update(req.body.password).digest('hex');
	knex('user')
		.where({email: req.body.email, password: hashpw, verified: 1})
		.then(user => {
			if (user.length == 0) {
				req.flash('error_msg', 'Invalid username or password!');
				return res.redirect('/login');
			} else {
// console.log(user);
				req.session.user = user[0];
				req.session.user.interests = [];
				knex('user')
					.where({id: req.session.user.id})
					.update({loggedIn: 1})
					.then(() => {
						req.session.user.loggedIn = 1;
						me = getLocation(user[0].id);
						me.then(function(result) {
							global.loc = [result.postal, result.city, result.region];
						}).then (function (result){
							req.session.user.location = global.loc;
						});
					}).then(() => {
						knex('interest')
							.where({user_id: req.session.user.id})
							.then((interests) => {
								interests.forEach((interest) => {
									req.session.user.interests.push(interest.interest);
								});
							}).then(() => {
								return (res.redirect('/'));
							}).catch((err) => { throw err; });
					}).catch((err) => { throw err; });
			}
		}).catch((err) => {
			console.error(err);
			return res.redirect('/login');
		})
}

function getLocation(id) {
	return new Promise(function(resolve, reject){
		fs.readFile("IPAddresses.txt", 'utf8',function(err, data){
			if(err) throw err;
			var lines = data.split('\n');
			var ip = lines[Math.floor(Math.random()*lines.length)];
			// will have to store this as object here, AND CHECK WHERE THIS IS USED TO RECONVERT TO []?
			iplocation(ip, [], (error, res) => {
				location = {
					user_id: id,
					postal: res.postal,
					city: res.city,
					region: res.region
				};
				// create row for user location if this is 1st time logging in
				// otherwise, update location
				knex('location')
					.where({user_id: id})
					.then((row) => {
						if (row.length === 0)
							knex('location').insert(location);
						else
							knex('location').where({user_id: id}).update(location);
					}).catch((err) => { console.log('some shit went down'); });
				resolve(location);
			});
		});
	})
}
// Register
// GET method
exports.getregister = (req, res, next) => {
	loggedUser = 0;
	return (res.render(path.resolve('views/register'),{
		user: loggedUser
	}));
}
// POST method
// if something isn't working, try removing all the .finally() statements - only call on outer scope?
exports.postregister = (req, res, next) => {
	var validate = new Validate();
	check_reg = validate.validateregister(req.body);
	if (check_reg == 0) {
		req.flash('error_msg', 'Please check your registration credentials');
		return (res.redirect('/register'));
	}
	var vkey = crypto.createHash('whirlpool').update(req.body.username).digest('hex');
	if (req.body.password != req.body.confirm_password) {
		req.flash('error_msg', 'Passwords do not match');
		return (res.redirect('/register'));
	} else {
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
        	  <p>Click this <a href="http://localhost:${process.env.PORT}/confirm?key=${vkey}">link</a> to confirm your account.</p>
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
		const user = {
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
			maxdist: req.body.dist
		};
		// query schema to see if username or email exists
		knex('user')
			.where({username: user.username})
			.orWhere({email: user.email})
			.select('id')
			.then(rows => {
				if (rows.length > 0) {
					req.flash('error_msg', 'Invalid username or email is already taken.');
					return (res.redirect('/register'));
				}
				knex('user')
					.insert(user)
					.then(id => { // returns [ id ] of inserted row
						var id_to_user = id[0];
						var date = Date.now();
						const new_photo = {
							photo: req.file.buffer.toString('base64'),// might have to store as blob
							photoid: date+id[0], //so that photoids are more unique
							user_id: id_to_user,
							isprofile: 1,
						}
						knex('photo')
							.insert(new_photo)
							.then((id) => {
								return (res.redirect('/'));
							}).catch((err) => {
								console.error(res.status(400).send(err));
								return (res.redirect('/'));
							})
					}).catch((err) => {
						console.error(res.status(400).send(err));
						return (res.redirect('/'));
					})
			}).catch((err) => {
				console.error(res.status(400).send(err))
			});
	}
}

exports.getconfirm = (req, res, next) => {
	var key = req.query.key;
	knex('user')
		.where({verifkey: key})
		.update({verified: 1})
		.then(() => {
			return (res.redirect('/'));
		}).catch((err) => {
			console.log("Something wrong when updating data!", err);
		});
}

exports.getlogout = (req, res, next) => {
	knex('user')
		.where({id: req.session.user.id})
		.update({lastSeen: Date.now(), loggedIn: 0})
		.then(() => {
			req.session.user = null;
			return (res.redirect('/'));
		}).catch((err) => {
			console.log('Something went wrong: ', err);
		});
}
// Send Reset Password Link
// GET method
exports.getresetpwd = (req, res, next) => {
	return (res.render(path.resolve('views/send_reset_password')));
}

exports.postresetpwd = (req, res, next) => {
	console.log("uhandle postresetpwd reached(Controller)");
	knex('user')
		.where({email: req.body.resetpwd_email})
		.then((row) => {
			if (row.length == 0) {
				req.flash('error_msg', 'Email does not exist');
				return res.redirect('/login');
			}
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
				<p>Click this <a href="http://localhost:${process.env.PORT}/resetpassword">link</a> to reset you password.</p>
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
		}).catch((err) => {
			console.log(res.status(400).send(err));
			return res.redirect('/login');
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

exports.postresetpassword = (req, res, next) => {
	console.log("uhandle postresetpassword reached(Controller)");
	knex('user')
		.where({email: req.body.confirm_email})
		.then((row) => {
			if (row.length == 0) {
				console.log(res.status(400).send(err));
				return res.redirect('/login');
			}
			if (req.body.new_pass_forgot != req.body.confirm_new_pass_forgot) {
				req.flash('error_msg', 'Passwords do not match');
				// return res.redirect('/login');
			} else {
				var check = new Validate();
				var pwcheck = check.ValidatePassword(req.body.new_pass_forgot);
				if (pwcheck == 0) {
					// put flash in
					return(res.redirect('/update_info'));
				}
				var forgothashedpw = crypto.createHash('whirlpool').update(req.body.new_pass_forgot).digest('hex');
				knex('user')
					.where({email: req.body.confirm_email})
					.update({password: forgothashedpw})
					.then((result) => {
						console.log("Password updated successfully");
						req.session.user = 0;
						return (res.redirect('/'));
					}).catch((err) => {
						console.log("Something wrong when updating data!", err);
					})
			}
		}).catch((err) => {
			console.log("you do not exist, what are you doing here?", err);
		});
}

exports.getinterests = (req, res, next) => {
	console.log("uhandle getinterest reached(Controller)");
	if (req.session.user === null || req.session.user === 0){
		return (res.redirect('/login'));
	} else {
		knex('interest')
			.where({user_id: req.session.user.id})
			.then((rows) => {
				var interests = rows.map((val) => {
					return val.interest;
				});
				var all_interests = all_pos_interests;
				return (res.render(path.resolve('views/interests'), {interests, all_interests}));
			}).catch((err) => {
				console.log('Something went wrong when retrieving interests!', err);
				return (res.redirect('/login'))
			})
	}
}

exports.postinterests = (req, res, next) => {
	const { interests } = req.body;
	// when req.body has 1 value, it is "String", if values >1, it is ["String", "String"]
	req.session.user.interests = [];
	var currUser = req.session.user;
	var updateInterests = [];
	if (Array.isArray(interests)) {
		for (var interest of interests) {
			updateInterests.push({user_id: currUser.id, interest: interest});
			req.session.user.interests.push(interest);
		}
	} else {
		updateInterests.push({user_id: currUser.id, interest: interests});
		req.session.user.interests.push(interests);
	}
	knex('interest')
		.where({user_id: currUser.id})
		.del()
		.then(() => console.log("Interests deleted"))
	knex('interest')
		.insert(updateInterests)
		.then(() => {
			console.log("req.session.user.interests", req.session.user.interests);
		})
		.finally(() => { return (res.redirect('/')); })
		.catch((err) => console.log('Something went wrong when inserting interest!', err));
}


exports.getProfile = (req, res, next) => {
	currUser = req.session.user
	if (!currUser) {
		res.status(400).send(err);
	}
	var profileUsrId = parseInt(req.params.id);
	if (profileUsrId != currUser.id) {
		knex('view')
			.insert({viewedUser: profileUsrId, viewedBy: currUser.id})
			.then((row) => console.log('view recorded: ', row))
			.catch((err) => {
				console.log('Something went wrong when updating views!', err);
				res.status(400).send(err);
			});
	}
	knex('user')
		.where({id: profileUsrId})
		.then((user) => {
			console.log(user);
			knex('photo')
				.where({user_id: profileUsrId})
				.then((photos) => {
					res.render(path.resolve('views/index'),{user: user[0], photos: photos, loggedUser: req.session.user});
				}).catch((err) => {
					console.log("Something went wrong! Cannot find photos!", err);
				});
		}).catch((err) => {
			console.log("Something went wrong! Cannot find user!", err);
			res.status(400).send(err);
		});
}

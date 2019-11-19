const User = require('../models/umod');
const path	= require('path');
var currUser;

exports.getMatches = (req, res, next) => {
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}

	currUser = req.session.user;

	if (currUser) {
		User.find(
			{gender: currUser.genderpref, genderpref: currUser.gender, age: {$gt: currUser.agepreflower, $lt: currUser.ageprefupper}},
			{}, {sort: {fame: -1}},(err, matches) => {
			if (err) {
				console.log(res.status(400).send(err));
			}
			else if (!matches) {
				console.log('No matches for you!');
			}
			else {
				matches.forEach(element => {
					console.log(element.username);
				});
			}
			return (res.render(path.resolve('views/matches'), {matches: matches}));
		});
	}
	else {
		return (res.redirect('/'));
	}
}

exports.like = (req, res, next) => {
	let liked = req.body.user;
	// console.log(liked);
}


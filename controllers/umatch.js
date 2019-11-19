const User = require('../models/umod');
const path	= require('path');
var currUser;

exports.getMatches = (req, res, next) => {
	// find all from users where:
	//	-	match.gender == user.genderpref && match.genderpref == user.gender
	//	-	user.agepreflower < match.age < user.ageprefupper &&
	//			match.agepreflower < user.age < match.ageprefupper
	//	-	match.location within range of user.location + maxdist
	//	-	order by fame desc
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}

	currUser = req.session.user;

	// should not be able to access matches page without being logged in, so no user authentication needed?

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
		return (res.render(path.resolve('views/matches'), {locals: {matches: matches}}));
	});
}


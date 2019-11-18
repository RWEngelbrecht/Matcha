const User = require('../models/umod');
const path	= require('path');
var currUser;

exports.getMatches = (req, res, next) => {
	// find all from users where:
	//	-	match.gender == user.genderpref && match.genderpref == user.gender
	//	-	user.agepreflower < match.age < user.ageprefupper &&
	//			match.agepreflower < user.age < match.ageprefupper
	//	-	at least 1 user.interests[] in match.interests[]
	//	-	match.location within range of user.location + maxdist
	//	-	order by fame desc
	currUser = req.session.user;
	// should not be able to access matches page without being logged in, so no user authentication needed?
	
	return (res.render(path.resolve('views/matches')));
}


const User = require('../models/umod');
var sessionData;

exports.getMatches = (req, res, next) => {
	// find all from users where:
	//	-	match.gender == user.genderpref && match.genderpref == user.gender
	//	-	user.agepreflower < match.age < user.ageprefupper &&
	//			match.agepreflower < user.age < match.ageprefupper
	//	-	at least 1 user.interests[] in match.interests[]
	//	-	match.location within range of user.location + maxdist
	//	-	order by fame desc
}

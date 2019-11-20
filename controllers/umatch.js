const User = require('../models/umod');
const Likes = require('../models/likemod');
const path	= require('path');
var currUser;


exports.getMatchSuggestions = (req, res, next) => {
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
			// else {
			// 	Likes.find()
			// 	matches.forEach(element => {
			// 		console.log(element.username);
			// 	});
			// }
			return (res.render(path.resolve('views/matches'), {matches: matches}));
		});
	}
	else {
		return (res.redirect('/'));
	}
}

exports.like = (req, res, next) => {
	var likedkey = req.body.potmatch;
	currUser = req.session.user;
	console.log('currUser is %s', currUser.username);

	User.findOneAndUpdate({verifkey: likedkey}, {$inc:{fame:1}}, {new: true}, (err, doc) => {
		if(err){
			console.log("Something went wrong when updating match data!");
		}
	}).then((doc) => {
		if (doc) {
			Likes.findOne({likedUser: doc._id}, (err, haveLiked) => {
				if (haveLiked != null) {
					console.log('Already liked this person!');
					return (res.redirect('/matches'));
				} else {
					const like = new Likes({
						likeBy: currUser._id,
						likedUser: doc._id
					});
					like.save((err) => {
						if (err){
							console.log(res.status(400).send(err));
						}
					});
					console.log(like.likedUser);
					return (res.redirect('/matches'));
				}
			});
		}
	});

	// Likes.findOne({likeBy: currUser._id}).
	// populate('likeBy').
	// populate('likedUser').
	// exec((err, like) => {
	// 	if (err) {
	// 		console.log(res.status(400).send(err));
	// 	}
	// 	console.log('%s likes %s', like.likeBy.username, like.likedUser.username);
	// });
}


const User = require('../models/umod');
const Likes = require('../models/likemod');
const Filter = require('./filter.class')
const path	= require('path');
var currUser;
var filters = new Filter();


function getInterestMatches(user, matches) {
	var userInterests = user.interests;
	var matchInterests = [];
	for (var i = 0; i < matches.length; i += 1) {
		if (matches[i].interests != null) {
			if (matches[i].interests.some(e => userInterests.indexOf(e) >= 0)) {
				matchInterests.push(matches[i]);
			}
		}
	}
	return (matchInterests);
}

exports.getMatchSuggestions = (req, res, next) => {
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	currUser = req.session.user;
	// console.log(currUser);
	// console.log("BELOW");
	console.log(req.session.user.interests);
	if (currUser) {
		User.find(
			{_id: {$ne: currUser._id}, gender: currUser.genderpref, genderpref: currUser.gender, age: {$gt: currUser.agepreflower, $lt: currUser.ageprefupper}},
			{}, {sort: {fame: -1}},(err, matches) => {
			if (err) {
				console.log(res.status(400).send(err));
			}
			else if (!matches) {
				console.log('No matches for you!');
			}
			else {
				var interestMatches = getInterestMatches(currUser, matches);
				var filteredMatches = filters.FilterFrom(interestMatches);
				}
			return (res.render(path.resolve('views/matches'), {matches: filteredMatches}));
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

exports.getFilter = (req, res, next) => {
	return (res.render(path.resolve('views/filter')));
}

exports.postFilter = (req, res, next) => {
	//give filter class all filters
	filters.SetFilters(req.body.filterCrit);
	return (res.redirect('/matches'));
}
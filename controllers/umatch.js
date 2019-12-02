const User = require('../models/umod');
const Likes = require('../models/likemod');
const Filter = require('./filter.class')
const path	= require('path');
const mongoose	= require('mongoose');
var currUser;
var filters = new Filter();

exports.getMatchSuggestions = (req, res, next) => {
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	currUser = req.session.user;
	if (!currUser) {
		return (res.redirect('/'));
	}
	var likedUsers;
	Likes.find({likeBy: currUser._id}, (err, liked) => {
		if (err) {
			return (res.status(400).send(err));
		}
		likedUsers = liked;
	}).then(() => {
		if (currUser) {
			User.find(
				{_id: {$ne: currUser._id}, gender: currUser.genderpref,
				genderpref: currUser.gender, age: {$gt: currUser.agepreflower,
					$lt: currUser.ageprefupper}}, {}, {sort: {fame: -1}},(err, matches) => {
				if (err) {
					console.log(res.status(400).send(err));
				}
				else if (!matches) {
					console.log('No matches for you!');
				}
				else {
					var interestMatches = filters.getInterestMatches(currUser, matches);
					var likeableMatches = filters.getLikeableMatches(likedUsers, interestMatches);
					var filteredMatches = filters.FilterFrom(likeableMatches);
				}
				res.render(path.resolve('views/suggestions'), {matches: filteredMatches});
			});
		}
		else {
			return (res.redirect('/'));
		}
	});
}

exports.getMatches = (req, res, next) => {

	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}

	currUser = req.session.user;
	if (!currUser)
		res.redirect('/');

	var likedUserIDs = [];
	var likedUsers = [];
	// Likes.find({likeBy: currUser._id})
	// 	.populate('likedUser')
	// 	.exec((err, liked) => {
	// 		if (err) {
	// 			return (res.status(400).send(err));
	// 		}
	// 		liked.forEach(user => {
	// 			likedUsers.push(user.likedUser); // profiles that current user has liked
	// 		});
	// 		Likes.find({likedUser: currUser._id}, (err, currLiked) => { // people that have liked the current user
	// 			var matched = filters.getMatched(currLiked, likedUsers); // filtered out people who user hasn't liked
	// 			//filter matched users that also liked current user from likedUsers
	// 			var notMatched = filters.filterMatches(likedUsers, matched);

	// 			return (res.render(path.resolve('views/matches'), {likedMatches: notMatched, matched: matched, user: currUser}));
	// 		});
	// 	});
	Likes.find({likeBy: currUser._id}).then((liked) => {
			liked.forEach(user => {
				likedUserIDs.push(user.likedUser); // profiles that current user has liked
			});
			User.find({_id: {$in: likedUserIDs}},(err, likedUsrs) => {
				Likes.find({likedUser: currUser._id}, (err, currLiked) => { // people that have liked the current user
					var matched = filters.getMatched(currLiked, likedUsrs); // filtered out people who user hasn't liked
													//filter matched users that also liked current user from likedUsers
					var notMatched = filters.filterMatches(likedUsrs, matched);

					res.render(path.resolve('views/matches'), {likedMatches: notMatched, matched: matched, user: currUser});
				});
			})
		})
		.catch((error) => {
			console.log(error);
		});
}

exports.like = (req, res, next) => {
	var likedkey = req.body.potmatch;
	currUser = req.session.user;
	User.findOneAndUpdate({verifkey: likedkey}, {$inc:{fame:1}}, {new: true}, (err, doc) => {
		if(err){
			console.log("Something went wrong when updating match data!");
		}
	}).then((doc) => {
		if (doc) {
			Likes.findOne({likedUser: doc._id, likeBy: currUser._id}, (err, haveLiked) => {
				if (haveLiked != null) {
					console.log('Already liked this person!');
					return (res.redirect('/suggestions'));
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
					return (res.redirect('/suggestions'));
				}
			});
		}
	});
}

exports.getFilter = (req, res, next) => {
	return (res.render(path.resolve('views/filter')));
}

exports.postFilter = (req, res, next) => {
	//give filter class all filters
	filters.SetFilters(req.body.filterCrit);
	return (res.redirect('/suggestions'));
}
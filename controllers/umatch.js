const User = require('../models/umod');
const Likes = require('../models/likemod');
const Filter = require('./filter.class')
const path	= require('path');
const nodemailer = require('nodemailer');
const Notifications = require('../models/notifmod');
const Message = require('../models/messages');
var currUser;
var filters = new Filter();

exports.getMatchSuggestions = (req, res, next) => {
	currUser = req.session.user;
	if (!currUser) {
		res.redirect('/');
	}
	var likedUsers;
	Likes.find({likeBy: currUser._id}, (err, liked) => {
		if (err) {
			res.status(400).send(err);
		}
		likedUsers = liked;
	}).then(() => {
		if (currUser) {
			User.find(
				{_id: {$ne: currUser._id}, username: {$nin: currUser.blocked}, gender: currUser.genderpref,
				genderpref: currUser.gender, age: {$gte: currUser.agepreflower,
					$lte: currUser.ageprefupper}}, {}, {sort: {fame: -1}},(err, matches) => {
				if (err) {
					res.status(400).send(err);
				}
				else if (!matches) {
					console.log('No matches for you!');
				}
				else {
					var interestMatches = filters.getInterestMatches(currUser, matches);
					var likeableMatches = filters.getLikeableMatches(likedUsers, interestMatches);
					var filteredMatches = filters.FilterFrom(currUser, likeableMatches)
					filteredMatches.then(function(result) {
						res.render(path.resolve('views/suggestions'), {matches: result, filters: filters.filterBy, loggedUser: currUser, user: currUser});
					});
				}
			});
		}
		else {
			res.redirect('/');
		}
	});
}

exports.getMatches = (req, res, next) => {

	currUser = req.session.user;
	if (!currUser)
		res.redirect('/');

	var likedUserIDs = [];
	var currUserLikedBy = [];
	Likes.find({likeBy: currUser._id}).then((liked) => {
			liked.forEach(user => {
				likedUserIDs.push(user.likedUser); // profiles that current user has liked
			});
			User.find({_id: {$in: likedUserIDs}, username: {$nin: currUser.blocked}},(err, likedUsrs) => {
				Likes.find({likedUser: currUser._id}, (err, currLiked) => {
					// people that have liked the current user
					currLiked.forEach(likedBy => {
						currUserLikedBy.push(likedBy.likeBy.toString())
					});
					User.find({_id: {$in: currUserLikedBy}}, (err, currLikedBy) => {
						var matched = filters.getMatched(currLiked, likedUsrs); // filtered out people who user hasn't liked
														//filter matched users that also liked current user from likedUsers
						var notMatched = filters.filterMatches(likedUsrs, matched);

						res.render(path.resolve('views/matches'), {likedMatches: notMatched, matched: matched, user: currUser, likedBy: currLikedBy});
					})
				});
			})
		})
		.catch((error) => {
			console.log(error);
		});
}

exports.like = (req, res, next) => {
	var likedName = req.body.potmatch;
	currUser = req.session.user;
	User.findOneAndUpdate(
		{username: likedName},
		{$inc:{fame:1},
		$push:{likedBy: currUser.username}},
		{new: true})
		.then((doc) => {
		if (doc) {
			Likes.findOne({likedUser: doc._id, likeBy: currUser._id}, (err, haveLiked) => {
				if (haveLiked != null) {
					console.log('Already liked this person!');
					res.redirect('/suggestions');
				} else {
					const like = new Likes({
						liker: currUser.username,
						liked: likedName,
						likeBy: currUser._id,
						likedUser: doc._id,
						liker: currUser.username,
						liked: likedName,
					});
					like.save((err) => {
						if (err){
							res.status(400).send(err);
						}
					});
					var transporter = nodemailer.createTransport({
						service: 'gmail',
						auth: {
						  user: "wethinkcodematcha@gmail.com",
						  pass: "Matcha1matcha"
						}
					});
					var mailOptions = {
						from: 'wethinkcodematcha@gmail.com',
						to: doc.email,
						subject: 'Someone likes you...',
						html: `
						  <h1>Someone is interested in you... Why?</h1>
						`
					};
					transporter.sendMail(mailOptions, function(error, info){
						if (error) {
						  console.log(error);
						} else {
						  console.log('Email sent: ' + info.response);
						}
					});
					res.redirect('/suggestions');
				}
			});
		}
	});
}

exports.block = (req, res) => {
		var likedUsername = req.body.liked;
		currUser = req.session.user;
		User.findOneAndUpdate(
			{username: likedUsername},
			{$inc:{fame:-1},
			$push: {blocked: currUser.username},
			$pull: {likedBy: currUser.username}},
			{new: true, multi: true},
			(err, doc) => {
				if(err){
					res.status(400).send(err);
				}
		});
		User.findOneAndUpdate(
			{_id: currUser._id},
			{$push: {blocked: likedUsername}},
			(err, usr) => {
				if (err) {
					res.status(400).send(err);
				}
		});
		Likes.findOneAndDelete({likeBy: currUser._id, likedUser: likedUsername}, (err, doc) => {
			if (err) {
				res.status(400);
			}
		});
		req.session.user.blocked.push(likedUsername)
		res.redirect('/matches');
}

exports.getFilter = (req, res, next) => {
	res.render(path.resolve('views/filter'));
}

exports.postFilter = (req, res, next) => {
	//give filter class all filters
	filters.SetFilters(req.body.filterCrit);
	res.redirect('/suggestions');
}

exports.clearFilter = (req, res, next) => {
	filters.ClearFilters();
	res.redirect('/suggestions');
}

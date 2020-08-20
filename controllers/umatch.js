const knex = require('../database');
const Filter = require('./filter.class')
const path	= require('path');
const nodemailer = require('nodemailer');
var currUser;
var filters = new Filter();

// exports.getMatchSuggestions = (req, res, next) => {
// 	currUser = req.session.user;
// 	if (!req.session.user) {
// 		res.redirect('/');
// 	}
// 	var likedUsers;
// 	Likes.find({likeBy: currUser._id}, (err, liked) => {
// 		if (err) {
// 			res.status(400).send(err);
// 		}
// 		likedUsers = liked;
// 	}).then(() => {
// 		if (currUser) {
// 			User.find(
// 				{_id: {$ne: currUser._id}, username: {$nin: currUser.blocked}, gender: currUser.genderpref,
// 				genderpref: currUser.gender, age: {$gte: currUser.agepreflower,
// 					$lte: currUser.ageprefupper}}, {}, {sort: {fame: -1}},(err, matches) => {
// 				if (err) {
// 					console.log('something fucked up')
// 					// res.status(400).send(err);
// 					console.error(err);
// 				}
// 				else if (!matches) {
// 					console.log('No matches for you!');
// 				}
// 				else {
// 					var interestMatches = filters.getInterestMatches(currUser, matches);
// 					var likeableMatches = filters.getLikeableMatches(likedUsers, interestMatches);
// 					var filteredMatches = filters.FilterFrom(currUser, likeableMatches)
// 					filteredMatches.then(function(result) {
// 						res.render(path.resolve('views/suggestions'), {matches: result, filters: filters.filterBy, loggedUser: currUser, user: currUser});
// 					});
// 				}
// 			});
// 		}
// 		else {
// 			res.redirect('/');
// 		}
// 	});
// }
// knex('blocked')
// 	.where({blockBy: currUser.id})
// 	.then((blocked) => {
// 		var blockedUsers = [];
// 		for (var block of blocked) {
// 			blockedUsers.push(block.blocked);
// 		}
// })
exports.getMatchSuggestions = (req, res, next) => {
	currUser = req.session.user;
	if (!req.session.user) {
		res.redirect('/');
	}
	var likedUsers;
	var blockedUsers = [];
	var possibleMatches = [];
	knex('like')
		.where({likeBy: currUser.id})
		.then((liked) => {
			likedUsers = liked;
			knex('blocked')
				.where({blockBy: currUser.id})
				.orWhere({blocked: currUser.id}) // so we don't need 2 rows in table for each block
				.then((blocked) => {
					for (var block of blocked) {
						blockedUsers.push(block.blocked);
					}
				}).catch((err) => { throw err; })
		})
		.then(() => {
			knex('user')
				.whereNotIn('id', blockedUsers)
				.andWhereNot({id: currUser.id})
				.andWhere({gender: currUser.genderpref, genderpref: currUser.gender})
				.andWhere('age', '>=', currUser.agepreflower)
				.andWhere('age', '<=', currUser.ageprefupper)
				.orderBy('fame', 'desc')
				.then((matches) => {
					if (matches.length === 0) {
						console.log('No matches for you!');
						res.redirect('/');
					}
					knex('interest')
						.select()
						.then((interests) => {
							matches.forEach((match) => {
								match.interests = interests.filter(interest => interest.user_id === match.id);
							});
						})
						.then(() => {
							possibleMatches = matches;
						}).then(() => {
							var interestMatches = filters.getInterestMatches(currUser, possibleMatches);
							var likeableMatches = filters.getLikeableMatches(likedUsers, interestMatches);
							var filteredMatches = filters.FilterFrom(currUser, likeableMatches)
							return filteredMatches;
						}).then((filteredMatches) => {
							res.render(path.resolve('views/suggestions'), {matches: filteredMatches, filters: filters.filterBy, loggedUser: currUser, user: currUser});
						}).catch((err) => { throw err; });
				}).catch((err) => { throw err; });
		}).catch((err) => {
			res.status(400).send(err);
		});
}

// exports.getMatches = (req, res, next) => {
// 	if (!req.session.user)
// 		res.redirect('/');

// 	User.find({username: req.session.user.username}, (err, loggedInUser) => {
// 		currUser = loggedInUser[0];

// 		var likedUserIDs = [];
// 		var currUserLikedBy = [];
// 		Likes.find({likeBy: currUser._id}).then((liked) => {
// 				liked.forEach(user => {
// 					likedUserIDs.push(user.likedUser); // profiles that current user has liked
// 				});
// 				User.find({_id: {$in: likedUserIDs}, username: {$nin: currUser.blocked}},(err, likedUsrs) => {
// 					Likes.find({likedUser: currUser._id}, (err, currLiked) => {
// 						// people that have liked the current user
// 						currLiked.forEach(likedBy => {
// 							currUserLikedBy.push(likedBy.likeBy.toString())
// 						});
// 						User.find({_id: {$in: currUserLikedBy}}, (err, currLikedBy) => {
// 							var matched = filters.getMatched(currLiked, likedUsrs); // filtered out people who user hasn't liked
// 															//filter matched users that also liked current user from likedUsers
// 							var notMatched = filters.filterMatches(likedUsrs, matched);

// 							res.render(path.resolve('views/matches'), {likedMatches: notMatched, "matched": matched, user: currUser, likedBy: currLikedBy});
// 						})
// 					});
// 				})
// 			})
// 			.catch((error) => {
// 				console.log(error);
// 			});
// 	})
// 	// req.session.user = currUser;
// }
exports.getMatches = (req, res, next) => {
	if (!req.session.user)
		res.redirect('/');
	var likedUserIDs = [];
	var currUserLikedBy = [];
	var blockedUsers = [];
	knex('user')
		.where({username: req.session.user.username})
		.then((loggedInUser) => {
			currUser = loggedInUser[0];
		})
		.then(() => {
			knex('like')
				.where({likeBy: currUser.id})
				.then((liked) => {
					if (liked.length === 0) {
						res.redirect('/suggestions');
					} else {
						liked.forEach(user => {
							likedUserIDs.push(user.likedUser); // profiles that current user has liked
						});
						knex('blocked')
							.where({blockBy: currUser.id})
							.andWhere({blocked: currUser.id})
							.then((blocked) => {
								for (var block of blocked) {
									blockedUsers.push(block.blocked);
								}
							})
							.then(() => {
								knex('user')
									.whereNotIn('id', blockedUsers)
									.whereIn('id', likedUserIDs)
									.then((likedUsrs) => {
										knex('like')
											.where({likedUser: currUser.id})
											.then((currLiked) => {
												currLiked.forEach(likedBy => {
													currUserLikedBy.push(likedBy.likeBy);
												});
												return currLiked;
											})
											.then((currLiked) => {
												knex('user')
													.whereIn('id', currUserLikedBy)
													.then((currLikedBy) => {
														var matched = filters.getMatched(currLiked, likedUsrs); // filtered out people who user hasn't liked
																		//filter matched users that also liked current user from likedUsers
														var notMatched = filters.filterMatches(likedUsrs, matched);
														res.render(path.resolve('views/matches'), {likedMatches: notMatched, "matched": matched, user: currUser, likedBy: currLikedBy});
													})
											})
									})
							})
					}
				})
			})
	// req.session.user = currUser;
}


// exports.like = (req, res, next) => {
// 	var likedName = req.body.potmatch;
// 	currUser = req.session.user;
// 	User.findOneAndUpdate(
// 		{username: likedName},
// 		{$inc:{fame:1},
// 		$push:{likedBy: currUser.username}},
// 		{new: true})
// 		.then((doc) => {
// 		if (doc) {
// 			Likes.findOne({likedUser: doc._id, likeBy: currUser._id}, (err, haveLiked) => {
// 				if (haveLiked != null) {
// 					console.log('Already liked this person!');
// 					res.redirect('/suggestions');
// 				} else {
// 					const like = new Likes({
// 						liker: currUser.username,
// 						liked: likedName,
// 						likeBy: currUser._id,
// 						likedUser: doc._id,
// 						liker: currUser.username,
// 						liked: likedName,
// 					});
// 					like.save((err) => {
// 						if (err){
// 							res.status(400).send(err);
// 						}
// 					});
// 					res.redirect('/suggestions');
// 				}
// 			});
// 		}
// 	});
// }
exports.like = (req, res, next) => {
	var likedName = req.body.potmatch;
	currUser = req.session.user;
	knex('user')
		.where({username: likedName})
		.increment({fame: 1})
		.then(() => {
			knex('user')
				.where({username: likedName})
				.then((liked) => {
					const like = {
						liker: currUser.username,
						liked: likedName,
						likeBy: currUser.id,
						likedUser: liked[0].id,
						liker: currUser.username,
						liked: likedName,
					};
					return like;
				}).then((like) => {
					knex('like')
						.insert(like)
						.then(() => { res.redirect('/suggestions'); })
						.catch((err) => { throw err; })
				}).catch((err) => { throw err });
		}).catch((err) => { throw err });
}

// exports.block = (req, res) => {
// 		var likedUsername = req.body.liked;
// 		currUser = req.session.user;
// 		User.findOneAndUpdate(
// 			{username: likedUsername},
// 			{$inc:{fame:-1},
// 			$push: {blocked: currUser.username},
// 			$pull: {likedBy: currUser.username}},
// 			{new: true, multi: true},
// 			(err, doc) => {
// 				if(err){
// 					res.status(400).send(err);
// 				}
// 		});
// 		User.findOneAndUpdate(
// 			{_id: currUser._id},
// 			{$push: {blocked: likedUsername}},
// 			(err, usr) => {
// 				if (err) {
// 					res.status(400).send(err);
// 				}
// 		});
// 		Likes.findOneAndDelete({likeBy: currUser._id, likedUser: likedUsername}, (err, doc) => {
// 			if (err) {
// 				res.status(400);
// 			}
// 		});
// 		req.session.user.blocked.push(likedUsername)
// 		res.redirect('/matches');
// }
exports.block = (req, res) => {
	var likedUsername = req.body.liked;
	currUser = req.session.user;
	knex('user')
		.where({username: likedUsername})
		.decrement({fame: 1})
		.then(() => {
			knex('user')
				.where({username: likedUsername})
				.then((likedUser) => {
					knex('blocked')
						.insert({blockBy: currUser.id, blocked: likedUser[0].id})
						.catch((err) => { throw err; });
					knex('like')
						.where({likeBy: likedUser[0].id, likedUser: currUser.id})
						.andWhere({likeBy: currUser.id, likedUser: likedUser[0].id})
						.del()
						.catch((err) => { throw err; });
				})
				.then(() => { res.redirect('/matches'); })
				.catch((err) => { throw err; });
		}).catch((err) => { throw err; });
}

exports.getFilter = (req, res, next) => {
	res.render(path.resolve('views/filter'));
}

exports.postFilter = (req, res, next) => {
	//give filter class all filters
	filters.SetFilters(req.body.filterCrit, req.body.sortCrit);
	res.redirect('/suggestions');
}

exports.clearFilter = (req, res, next) => {
	filters.ClearFilters();
	res.redirect('/suggestions');
}

const knex = require('../database');
const Filter = require('./filter.class')
const path	= require('path');
const nodemailer = require('nodemailer');
var currUser;
var filters = new Filter();

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
							} else {
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
							}
						}).catch((err) => { throw err; });
				}).catch((err) => { throw err; })
		}).catch((err) => {
			res.status(400).send(err);
		});
}


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
							.orWhere({blocked: currUser.id})
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
}


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

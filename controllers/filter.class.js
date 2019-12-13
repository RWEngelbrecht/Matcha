const Sort	= require('./order.class');

class Filter {
	constructor() {
		this.filterBy = [];
		this.orderBy;
	}

	SetFilters = (filters, sort) => {
		var i = 4;

		this.filterBy['ageFilter'] = filters[0];
		this.filterBy['fameFilter'] = filters[1];
		this.filterBy['genderFilter'] = filters[2];
		this.filterBy['locationFilter'] = filters[3];
		this.filterBy['interestsFilter'] = [];
		for (let i = 4; i < filters.length; i++) {
			this.filterBy['interestsFilter'].push(filters[i]);
		}
		this.orderBy = sort;
	}

	ClearFilters = () => {
		this.filterBy['ageFilter'] = '';
		this.filterBy['fameFilter'] = '';
		this.filterBy['genderFilter'] = '';
		this.filterBy['locationFilter'] = '';
		this.filterBy['interestsFilter'] = '';
	}

	getInterestMatches(user, matches) {
		var userInterests = user.interests;
		var matchInterests = [];
		for (var i = 0; i < matches.length; i++) {
			if (matches[i].interests != null) {
				if (matches[i].interests.some(e => userInterests.indexOf(e) >= 0)) {
					matchInterests.push(matches[i]);
				}
			}
		}
		return (matchInterests);
	}

// removes user profiles that appear in likedMatches from matches
//	likedMatches should be array of Likes documents (see likemod.js)
//	matches should be array of User docs
	getLikeableMatches(likedMatches, matches) {
		var _ = require('underscore');
		if (!likedMatches.length)
			return (matches);

		var likedIds = [];
		likedMatches.forEach(likd => {
			likedIds.push(likd.likedUser.toString());
		});

		var matchIds = [];
		matches.forEach(match => {
			matchIds.push(match._id.toString());
		});

		var likeable = _.difference(matchIds, likedIds);
		var matchLikeable = [];

		matches.forEach(match => {
			if (likeable.includes(match._id.toString())) {
				matchLikeable.push(match);
			}
		});
		return (matchLikeable);
	}

// returns users liked by currently logged-in user that have liked the current user.
//	likedBy holds users that liked current user (array of docs from Likes)
//	likedMatches holds users liked by current user (arr of docs from User)
	getMatched(likedBy, likedMatches) {
		var _ = require('underscore');
		if (!likedBy.length)
			return (likedBy);

		var likers = [];
		likedBy.forEach(likd => {
			likers.push(likd.likeBy.toString());
		});

		var likedMatchIds = [];
		likedMatches.forEach(match => {
			likedMatchIds.push(match._id.toString());
		});

		var matched = _.intersection(likedMatchIds, likers);
		var matchedUsers = [];

		likedMatches.forEach(match => {
			if (matched.includes(match._id.toString())) {
				matchedUsers.push(match);
			}
		});
		return (matchedUsers);
	}

	filterMatches = (likedUsers, matched) => {

		var _ = require('underscore');

		if (!matched)
			return (likedUsers);

		var likedUsersNames = [];
		likedUsers.forEach(notMatch => {
			likedUsersNames.push(notMatch.username);
		});
		var matchedNames = [];
		matched.forEach(match => {
			matchedNames.push(match.username);
		});
		var notMatches = _.difference(likedUsersNames, matchedNames);
		var notMatchUsers = [];
		likedUsers.forEach(liked => {
			if (notMatches.includes(liked.username)) {
				notMatchUsers.push(liked);
			}
		});
		return (notMatchUsers);
	}

	FilterFrom = (user, matches) => {
		var filterby = this.filterBy
		var orderby = this.orderBy
		return new Promise(function (resolve, reject) {

			var filter = 0;
			var order = 0
			var filteredMatches = [];
		// if filters empty, don't filter
		for (var el in filterby) {
			if (filterby[el] != '' && typeof filterby[el] !== 'undefined') {
				filter = 1;
			}
		}
		if (orderby == 1 || orderby == 2 || orderby == 3 || orderby == 4 || orderby == 5) {
			order == 1
		}
		if (filter == 0 && order == 0) {
			resolve (matches);
		}
		//currently filters inclusively
		matches.forEach(element => {
			if (element.age == filterby['ageFilter'] && filterby['ageFilter'] != '')
				filteredMatches.push(element);
				else if (element.fame >= filterby['fameFilter'] && filterby['fameFilter'] != '')
				filteredMatches.push(element);
			else if (element.gender == filterby['genderFilter'] && filterby['genderFilter'] != '')
			filteredMatches.push(element);
			else if (filterby['locationFilter'] != '') {
				if (filterby['locationFilter'] === 'suburb' && element.location[0] === user.location[0])
					filteredMatches.push(element);
					else if (filterby['locationFilter'] === 'city' && element.location[1] === user.location[1])
					filteredMatches.push(element);
				}
			else if (element.interests.some(r => filterby['interestsFilter'].indexOf(r)  >= 0) && filterby['interestsFilter'] != '')
				filteredMatches.push(element);
		});
		var sortBy = new Sort(user._id, user.interests);
		var ret = [];
		if (orderby == 1) {
			if (filter == 1) {
				var ret = sortBy.OrderByAgeAsc(filteredMatches);
				ret.then(function(result) {
					resolve(result);
				}, function(err) {
				})
			}
			var ret = sortBy.OrderByAgeAsc(matches);
			ret.then(function(result) {
				resolve(result);
			}, function(err) {
				console.log(err);
			})
		} if (orderby == 2) {
			if (filter == 1) {
				var ret = sortBy.OrderByAgeDesc(filteredMatches);
				ret.then(function(result) {
					resolve(result);
				}, function(err) {
					console.log(err);
				})
			}
			var ret = sortBy.OrderByAgeDesc(matches);
			ret.then(function(result) {
				resolve(result);
			}, function(err) {
				console.log(err);
			})
		} if (orderby == 3) {
			if (filter == 1) {
				var ret = sortBy.OrderByFameAsc(filteredMatches);
				ret.then(function(result) {
					resolve(result);
				}, function(err) {
					console.log(err);
				})
			}
			var ret = sortBy.OrderByFameAsc(matches);
			ret.then(function(result) {
				resolve(result);
			}, function(err) {
				console.log(err);
			})
		} if (orderby == 4) {
			if (filter == 1) {
				var ret = sortBy.OrderByFameDesc(filteredMatches);
				ret.then(function(result) {
					resolve(result);
				}, function(err) {
					console.log(err);
				})
			}
			var ret = sortBy.OrderByFameDesc(matches);
			ret.then(function(result) {
				resolve(result);
			}, function(err) {
				console.log(err);
			})
		} if (orderby == 5) {
			if (filter == 1) {
				var ret = sortBy.OrderByNBInterests(filteredMatches);
				ret.then(function(result) {
					resolve(result);
				}, function(err) {
					console.log(err);
				})
			}
			var ret = sortBy.OrderByNBInterests(matches);
			ret.then(function(result) {
				resolve(result);
			}, function(err) {
				console.log(err);
			})
		} else {
			resolve (filteredMatches);
		}
		// return (filteredMatches);
	})
	}
}

module.exports = Filter;



	// test = new Order(req.session.user._id, req.session.user.interests);
	// me = test.OrderByNBInterests();
	// me.then(function(result) {
    //     userDetails = result;
    //     console.log("Initialized user details");
    //     // Use user details from here
    //     console.log(userDetails)
    // }, function(err) {
    //     console.log(err);
	// });
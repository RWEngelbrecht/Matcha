class Filter {
	constructor() {
		this.filterBy = [];
	}

	SetFilters = filters => {
		this.filterBy['ageFilter'] = filters[0];
		this.filterBy['fameFilter'] = filters[1];
		this.filterBy['genderFilter'] = filters[2];
		this.filterBy['locationFilter'] = filters[3];
		this.filterBy['interestsFilter'] = filters[4];
	}

	getInterestMatches(user, matches) {
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
	//removes user profiles that appear in likedMatches from matches
		//likedMatches should be array of Likes documents (see likemod.js)
		//matches should be array of User docs
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
	// returns user profiles that 
	getMatched(likedBy, likedMatches) {
		var _ = require('underscore');
		if (!likedBy.length)
			return (liked);

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

	FilterFrom = (matches) => {
		var filter = 0;
		var filteredMatches = [];
		// if filters empty, don't filter
		for (var el in this.filterBy) {
			if (this.filterBy[el] != '') {
				filter = 1;
			}
		}
		if (filter == 0) {
			return matches;
		}
		//currently filters inclusively
		matches.forEach(element => {
			if (element.age == this.filterBy['ageFilter'] && this.filterBy['ageFilter'] != '')
				filteredMatches.push(element);
			else if (element.fame >= this.filterBy['fameFilter'] && this.filterBy['fameFilter'] != '')
				filteredMatches.push(element);
			else if (element.gender == this.filterBy['genderFilter'] && this.filterBy['genderFilter'] != '')
				filteredMatches.push(element);
			else if (element.location == this.filterBy['locationFilter'] && this.filterBy['locationFilter'] != '')
				filteredMatches.push(element);
			else if (element.interests.indexOf(this.filterBy['interestsFilter'])  > -1 && this.filterBy['interestsFilter'] != '')
				filteredMatches.push(element);
		});
		return (filteredMatches);
	}


}

module.exports = Filter;
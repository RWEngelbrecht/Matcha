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
			else if (element.interests == this.filterBy['interestsFilter'] && this.filterBy['interestsFilter'] != '')
				filteredMatches.push(element);
		});
		return (filteredMatches);
	}
}

module.exports = Filter;
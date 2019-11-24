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
		this.filterBy.forEach(el => {
			if (el != '')
				filter = 1;
		})
		if (filter == 0)
			return matches;
		matches.forEach(element => {
			if (element.age == this.filterBy['ageFilters'])
				filteredMatches.push(element);
			else if (element.fame >= this.filterBy['fameFilter'])
				filteredMatches.push(element);
			else if (element.gender == this.filterBy['genderFilter'])
				filteredMatches.push(element);
			else if (element.location == this.filterBy['locationFilter'])
				filteredMatches.push(element);
			else if (element.interests == this.filterBy['interestsFilter'])
				filteredMatches.push(element);
		});
		return (filteredMatches);
	}
}

module.exports = Filter;
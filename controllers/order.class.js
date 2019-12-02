const User	= require('../models/umod');
const _     = require('underscore');

class Order {
    constructor(user, interests) {
        this.user = user;
        this.interests = interests;
    }

    OrderByNBInterests(/* THIS MAY TAKE AN ARRAY MAKING THE "User.find" REDUNDANT */) {
        var this_user = this.user;
        var this_interests = this.interests;
        return new Promise(function(resolve, reject) {
            User.find({_id: {$ne: this_user}}, (err, users) => {
                if (err) {
				    console.log(err);
			    } else {
                    var array = [];
                    users.forEach(user => {
                        var common = _.intersection(this_interests, user.interests).length;
                        array.push([user._id, common]);
                    });
                    var i = 0, temp = [];
                    while (i + 1 < array.length) {
                        if (array[i][1] == 0) {
                            array.splice(1, i);
                            i = 0;
                        };
                        if (array[i][1] < array[i + 1][1]) {
                            temp = array[i];
                            array[i] = array[i + 1];
                            array[i + 1] = temp;
                            i = 0; 
                        }
                        i++;
                    }
                    if (array) {
                        resolve (array);
                    } else {
                        reject (array);
                    }
                };
            });
        });
    }
    
    OrderByAgeAsc() {
        var this_user = this.user;
        var this_interests = this.interests;
        return new Promise(function(resolve, reject) {
            User.find({_id: {$ne: this_user}}, (err, users) => {
                if (err) {
                    console.log(err);
                    reject(users);
			    } else {
                    var array = [];
                    users.forEach(user => {
                        array.push([user._id, user.age]);
                    });
                    var i = 0, temp = [];
                    while (i + 1 < array.length) {
                        if (array[i][1] > array[i + 1][1]) {
                            temp = array[i];
                            array[i] = array[i + 1];
                            array[i + 1] = temp;
                            i = 0; 
                        }
                        i++;
                    }
                    if (array) {
                        resolve (array);
                    } else {
                        reject (array);
                    }
                };
            });
        });
    }

    OrderByAgeDesc() {
        var this_user = this.user;
        var this_interests = this.interests;
        return new Promise(function(resolve, reject) {
            User.find({_id: {$ne: this_user}}, (err, users) => {
                if (err) {
                    console.log(err);
                    reject(users);
			    } else {
                    var array = [];
                    users.forEach(user => {
                        array.push([user._id, user.age]);
                    });
                    var i = 0, temp = [];
                    while (i + 1 < array.length) {
                        if (array[i][1] < array[i + 1][1]) {
                            temp = array[i];
                            array[i] = array[i + 1];
                            array[i + 1] = temp;
                            i = 0; 
                        }
                        i++;
                    }
                    if (array) {
                        resolve (array);
                    } else {
                        reject (array);
                    }
                };
            });
        });
    }

    OderByLocation(uloc) {
        var this_user = this.user;
        var this_interests = this.interests;
        return new Promise(function(resolve, reject) {
            User.find({_id: {$ne: this_user}}, (err, users) => {
                if (err) {
                    console.log(err);
                    reject(users);
                } else {
                    var array = [];
                    users.forEach(user => {
                        array.push([user._id, user.location]);
                    });
                    var i = 0, temp = [], suburb = 0, city = 0, tcount = 0;
                    while (i + 1 < array.length) {
                        if (array[i][1][0] == uloc[0]) {
                            temp[tcount] = array[i];
                            tcount++;
                            array.splice(1, i);
                            i = 0;
                        }
                        if (suburb == 1 && (array[i][1][1] == uloc[1])) {
                            temp[tcount] = array[i];
                            tcount++;
                            array.splice(1, i);
                            i = 0;
                        }
                        if (suburb == 1 && city == 1) {
                            temp[tcount] = array[i];
                            tcount++;
                            array.splice(1, i);
                            i = 0;
                        }
                        i++;
                        if ((i + 1 == array.length) && (suburb == 0)) {
                            suburb = 1;
                            i = 0;
                        }
                        if ((i + 1 == array.length) && (city == 0)) {
                            city = 1;
                            i = 0;
                        }
                    }
                    resolve(temp);
                }

            });
        }); 
    }
    
}
module.exports = Order;
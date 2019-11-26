const User	= require('../models/umod');
const _     = require('underscore');

class Order {
    constructor(user, interests) {
        this.user = user;
        this.interests = interests;
    }

    OrderByNBInterests() {
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
}
module.exports = Order;
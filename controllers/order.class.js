const User	= require('../models/umod');
const _     = require('underscore');

class Order {
    constructor(user, interests) {
        this.user = user;
        this.interests = interests;
    }

    OrderByNBInterests(users) {
        var this_interests = this.interests;
        return new Promise(function(resolve, reject) {
            var i = 0, temp = [];
            while (i + 1 < users.length) {
                if (users[i][1] == 0) {
                    users.splice(1, i);
                    i = 0;
                };
                if (_.intersection(this_interests, users[i][1]).length < _.intersection(this_interests, users[i + 1][1]).length) {
                    temp = users[i];
                    users[i] = users[i + 1];
                    users[i + 1] = temp;
                    i = 0; 
                }
                i++;
            }
            if (users) {
                resolve (users);
            } else {
                reject (users);
            }
        });
    };
    
    OrderByAgeAsc(users) {
        return new Promise(function(resolve, reject) {
            var i = 0, temp = [];
            while (i + 1 < users.length) {
                if (users[i].age > users[i + 1].age) {
                    temp = users[i];
                    users[i] = users[i + 1];
                    users[i + 1] = temp;
                    i = 0; 
                }
                i++;
            }
            if (users) {
                resolve (users);
            } else {
                reject (users);
            }
        });
    }

    OrderByAgeDesc(user) {
        var users = user
        return new Promise(function(resolve, reject) {
            var i = 0, temp = [];
            while (i + 1 < users.length) {
                if (users[i].age < users[i + 1].age) {
                    temp = users[i];
                    users[i] = users[i + 1];
                    users[i + 1] = temp;
                    i = 0; 
                }
                i++;
            }
            if (users) {
                resolve (users);
            } else {
                reject (users);
            }
        });
    }

    OderByFameAsc(users) {
        return new Promise(function(resolve, reject) {
            var i = 0;
            while (i + 1 < users.length) {
                if (users[i].fame > users[i + 1].fame) {
                    temp = users[i];
                    users[i] = users[i + 1];
                    users[i + 1] = temp;
                    i = 0; 
                }
                i++;
            }
            if (users) {
                resolve(users);
            } else {
                reject(users);
            }
        });
    }

    OderByFameDesc(users) {
        return new Promise(function(resolve, reject) {
            var i = 0;
            while (i + 1 < users.length) {
                if (users[i].fame < users[i + 1].fame) {
                    temp = users[i];
                    users[i] = users[i + 1];
                    users[i + 1] = temp;
                    i = 0; 
                }
                i++;
            }
            if (users) {
                resolve(users);
            } else {
                reject(users);
            }
        });
    }
}
module.exports = Order;
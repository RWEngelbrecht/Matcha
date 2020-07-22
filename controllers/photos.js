// const User	= require('../models/umod');
// const Photo	= require('../models/photos');
const knex = require('../database');
const path	= require('path');

// GET photo landing page
exports.getphoto = (req, res, next) => {
	console.log("getphoto controller reached reached");
    userphotocount = req.session.user.photocount;
	loggedUser = req.session.user.username
	return (res.render(path.resolve('views/photos'), {
        photocount: userphotocount,
        user: loggedUser
    }));
}
// POST photo landing page
// exports.postphoto = (req, res, next) => {
//     date = Date.now();
//     const image = new Photo({
//         photo: req.file.buffer.toString('base64'),
//         photoid: date,
//         user: req.session.user._id,
//     });
//     image.save().then(item => {
//         key = req.session.user.verifkey;
//         pc = req.session.user.photocount + 1;
//         req.session.user.photocount = pc;
//         console.log("Photo Addition Successful")
//         User.findOneAndUpdate({verifkey: key}, {$set:{photocount:pc}},function(err, doc){
//             if(err){
//                 console.log("Something wrong when updating data!");
//             }
//             console.log("photocount updated successfully");
//         });
//         return (res.redirect('/photos'));
//     }).catch(err => {
//         console.log(res.status(400).send(err));
//         return (res.redirect('/'));
//     });
// }
exports.postphoto = (req, res, next) => {
    date = Date.now();
    const image = {
        photo: req.file.buffer.toString('base64'),
        photoid: date,
        user_id: req.session.user.id
	};
	knex('photo')
		.insert(image)
		.then(() => {
			key = req.session.user.verifkey;
			pc = req.session.user.photocount + 1;
			req.session.user.photocount = pc;
			console.log("Photo Addition Successful")
			knex('user')
				.where({verifkey: key})
				.update({photocount: pc})
				.then(() => {
					return (res.redirect('/photos'));
				})
				.catch((err) => { throw err; });
		}).catch((err) => {
			console.log(res.status(400).send(err));
			return (res.redirect('/'));
		 });
}
// GET deletephoto page
// exports.getdeletephoto = (req, res, next) => {
// 	console.log("getdeletephoto controller reached reached");
//     curr_user = req.session.user._id;
// 	Photo.find(
// 		{user: curr_user}, (err, photos) => {
// 		if (err) {
// 			console.log(res.status(400).send(err));
// 		}
// 		else if (!photos) {
// 			console.log('You Have No Photos, maybe its me being dumb though');
// 		}
// 		else {
// 			photos.forEach(element => {
// 				console.log(element._id);
// 			});
//         }
//         loggedUser = req.session.user.username
// 		return (res.render(path.resolve('views/photos_delete'), {
//             photo: photos,
//             user: loggedUser
//         }));
// 	});
// 	// return (res.render(path.resolve('views/photos_delete')));

// }
exports.getdeletephoto = (req, res, next) => {
	console.log("getdeletephoto controller reached reached");
	curr_user = req.session.user.id;
	knex('photo')
		.where({user_id: curr_user})
		.then((photos) => {
			loggedUser = req.session.user.username
			if (photos.length === 0) {
				return (res.render(path.resolve('views/photos'), {
					photocount: req.session.user.photocount,
					user: loggedUser
				}));
			}
			return (res.render(path.resolve('views/photos_delete'), {
				photo: photos,
				user: loggedUser
			}));
		})
		.catch((err) => {
			console.log(res.status(400).send(err));
		});
}
// POST deletephoto page
// exports.postdeletephoto = (req, res, next) => {
//     userphotocount = req.session.user.photocount;
// 	console.log("postdeletephoto controller reached reached");
//     curr_user = req.session.user._id;
//     to_delete = req.body.photo;
//     console.log(curr_user);
//     console.log(to_delete);
//     Photo.deleteOne({photoid: to_delete}, function(err) {
//         if (err) {
//             console.log(err);
//             return (res.redirect('/deletephoto'));
//         } else {
//             pc = req.session.user.photocount - 1;
//             req.session.user.photocount = pc;
//             key = req.session.user.verifkey;
//             console.log("Deletion Successful");
//             User.findOneAndUpdate({verifkey: key}, {$set:{photocount:pc}},function(err, doc){
//                 if(err){
//                     console.log("Something wrong when updating data!");
//                 }
//                 console.log("photocount updated successfully");
//             });
//             return (res.redirect('/photos'))
//         }
//     });
// }
exports.postdeletephoto = (req, res, next) => {
    userphotocount = req.session.user.photocount;
	console.log("postdeletephoto controller reached reached");
    curr_user = req.session.user.id;
	to_delete = req.body.photo;
	knex('photo')
		.where({photoid: to_delete})
		.del() // not sure if this can be followed by .then()
		.then(() => {
			pc = req.session.user.photocount - 1;
			req.session.user.photocount = pc;
			key = req.session.user.verifkey;
			console.log("Deletion Successful");
			knex('user')
				.where({ verifkey: key })
				.update({ photocount: pc })
				.then(() => { return (res.redirect('/photos')); })
				.catch((err) => { throw err; });
		})
		.catch((err) => {
			console.log(err);
			return (res.redirect('/deletephoto'));
		});
}
// GET editprofilepicture
exports.geteditprofilepicture = (req, res, next) => {
    console.log("geteditprofilepicture controller reached reached");
    loggedUser = req.session.user.username
    return (res.render(path.resolve('views/photo_profile_edit'), {
        user: loggedUser
    }));
}
// POST editprofilepicture
// exports.posteditprofilepicture = (req, res, next) => {
//     console.log("posteditprofilepicture controller reached reached");
//     userid = req.session.user._id;
//     if (req.session.user.photocount === 5) {
//         Photo.deleteOne({user: userid, isprofile: 1}, function(err, doc) {
//             if (err) {
//                 console.log("failed to delete a photo");
//                 return (res.redirect('/editprofilepicture'));
//             };
//         });
//         date = Date.now();
//         const newimage = new Photo ({
//             isprofile: 1,
//             photo: req.file.buffer.toString('base64'),
//             photoid: date,
//             user: req.session.user._id,
//         });
//         newimage.save().then( item => {
//             console.log("new profile picture added");
//             return (res.redirect('/photos'));
//         }).catch(err => {
//             console.log(res.status(400).send(err));
//             return (res.redirect('/'));
//         });
//     }
//     if (req.session.user.photocount <= 4) {
//         Photo.findOneAndUpdate({user: userid, isprofile: 1}, {$set:{isprofile: 0}}, function(err, doc) {
//             if (err) {
//                 console.log("failed to update");
//                 return (res.redirect('/photos'));
//             }
//             date = Date.now();
//             const newimage = new Photo ({
//                 isprofile: 1,
//                 photo: req.file.buffer.toString('base64'),
//                 photoid: date,
//                 user: req.session.user._id,
//             });
//             newimage.save().then( item => {
//                 console.log("new profile picture added");
//                 key = req.session.user.verifkey;
//                 pc = req.session.user.photocount + 1;
//                 req.session.user.photocount = pc;
//                 console.log("Photo Addition Successful")
//                 User.findOneAndUpdate({verifkey: key}, {$set:{photocount:pc}},function(err, doc){
//                     if(err){
//                         console.log("Something wrong when updating data!");
//                     }
//                     console.log("photocount updated successfully");
//                 });
//                 return (res.redirect('/photos'));
//             }).catch(err => {
//                 console.log(res.status(400).send(err));
//                 return (res.redirect('/'));
//             });
//         })
//     }
// }
exports.posteditprofilepicture = (req, res, next) => {
	console.log("posteditprofilepicture controller reached reached");
	userid = req.session.user.id;
	if (req.session.user.photocount === 5) {
		knex('photo')
			.where({user_id: userid, isprofile: 1})
			.del()
			.then(() => {
				date = Date.now();
				const newimage = {
					isprofile: 1,
					photo: req.file.buffer.toString('base64'),
					photoid: date+userid,
					user_id: req.session.user.id,
				};
				knex('photo')
					.insert(newimage)
					.then(() => { return (res.redirect('/photos')); })
					.catch((err) => {
						console.log(res.status(400).send(err));
						return (res.redirect('/'));
					})
			})
			.catch((err) => {
				console.log("failed to delete a photo");
				return (res.redirect('/editprofilepicture'));
			})
    }
    if (req.session.user.photocount <= 4) {
		knex('photo')
			.where({user: userid, isprofile: 1})
			.update({isprofile: 0})
			.then(() => {
				date = Date.now();
				const newimage = {
					isprofile: 1,
					photo: req.file.buffer.toString('base64'),
					photoid: date+userid,
					user_id: userid
				};
				knex('photo')
					.insert(newimage)
					.then(() => {
						console.log("new profile picture added");
						key = req.session.user.verifkey;
						pc = req.session.user.photocount + 1;
						req.session.user.photocount = pc;
						knex('user')
							.where({verifkey: key})
							.update({ photocount: pc })
							.then(() => {
								return (res.redirect('/photos'));
							})
							.catch((err) => {
								console.log("Something wrong when updating data!");
							})
					})
			}).catch((err) => {
				console.log("failed to update", err);
				return (res.redirect('/photos'));
			})
	}
}
// GET takephoto (BONUS)
exports.getakephoto = (req, res, next) => {
	console.log("gettakephoto controller reached reached");
	return (res.render(path.resolve('views/takephoto')));
}
// POST takephoto (BONUS)
// exports.postakephoto = (req, res, next) => {
//     console.log("gettakephoto controller reached reached");
//     date = Date.now();
//     var ret = req.body.webcamimage.replace('data:image/png;base64,','');
//     const image = new Photo({
//         photo: ret,
//         photoid: date,
//         user: req.session.user.id,
//     });
//     image.save().then(item => {
//         key = req.session.user.verifkey;
//         pc = req.session.user.photocount + 1;
//         req.session.user.photocount = pc;
//         console.log("Photo Addition Successful")
//         User.findOneAndUpdate({verifkey: key}, {$set:{photocount:pc}},function(err, doc){
//             if(err){
//                 console.log("Something wrong when updating data!");
//             }
//             console.log("photocount updated successfully");
//         });
//         return (res.redirect('/photos'));
//     }).catch(err => {
//         console.log(res.status(400).send(err));
//         return (res.redirect('/'));
//     });
// }
exports.postakephoto = (req, res, next) => {
    console.log("gettakephoto controller reached reached");
    date = Date.now();
    var ret = req.body.webcamimage.replace('data:image/png;base64,','');
    const image = {
        photo: ret,
        photoid: date+req.session.user.id,
        user_id: req.session.user.id
	};
	knex('photo')
		.insert(image)
		.then(() => {
			key = req.session.user.verifkey;
			pc = req.session.user.photocount + 1;
			req.session.user.photocount = pc;
			console.log("Photo Addition Successful")
			knex('user')
				.where({ verifkey: key })
				.update({ photocount: pc })
				.then(() => {
					return (res.redirect('/photos'));
				})
				.catch((err) => {
					console.log("Something wrong when updating data!", err);
				});
		}).catch((err) => {
			console.log(res.status(400).send(err));
			return (res.redirect('/'));
		});
}
// GET takeprofilephoto (BONUS)
exports.getakeprofilephoto = (req, res, next) => {
	console.log("gettakeprofilephoto controller reached reached");
	return (res.render(path.resolve('views/takeprofilephoto')));
}
// POST takeprofilephoto (BONUS)
// exports.postakeprofilephoto = (req, res, next) => {
//     console.log("postakeprofilephoto controller reached reached");
//     userid = req.session.user.id;
//     var ret = req.body.webcamimage.replace('data:image/png;base64,','');
//     if (req.session.user.photocount === 5) {
//         Photo.deleteOne({user: userid, isprofile: 1}, function(err, doc) {
//             if (err) {
//                 console.log("failed to delete a photo");
//                 return (res.redirect('/editprofilepicture'));
//             };
//         });
//         date = Date.now();
//         const image = new Photo({
//             isprofile: 1,
//             photo: ret,
//             photoid: date,
//             user: req.session.user.id,
//         });
//         image.save().then( item => {
//             console.log("photocount updated successfully");
//             return (res.redirect('/photos'));
//         }).catch(err => {
//             console.log(res.status(400).send(err));
//             return (res.redirect('/'));
//         });
//     }
//     if (req.session.user.photocount <= 4) {
//         Photo.findOneAndUpdate({user: userid, isprofile: 1}, {$set:{isprofile: 0}}, function(err, doc) {
//             if (err) {
//                 console.log("failed to update");
//                 return (res.redirect('/photos'));
//             }
//             date = Date.now();
//             const newimage = new Photo({
//                 isprofile: 1,
//                 photo: ret,
//                 photoid: date,
//                 user: req.session.user.id,
//             });
//             newimage.save().then( item => {
//                 console.log("new profile picture added");
//                 key = req.session.user.verifkey;
//                 pc = req.session.user.photocount + 1;
//                 req.session.user.photocount = pc;
//                 console.log("Photo Addition Successful")
//                 User.findOneAndUpdate({verifkey: key}, {$set:{photocount:pc}},function(err, doc){
//                     if(err){
//                         console.log("Something wrong when updating data!");
//                     }
//                     console.log("photocount updated successfully");
//                 });
//                 return (res.redirect('/photos'));
//             }).catch(err => {
//                 console.log(res.status(400).send(err));
//                 return (res.redirect('/'));
//             });
//         })
//     }
// }
exports.postakeprofilephoto = (req, res, next) => {
    console.log("postakeprofilephoto controller reached reached");
    userid = req.session.user.id;
    var ret = req.body.webcamimage.replace('data:image/png;base64,','');
    if (req.session.user.photocount === 5) {
		knex('photo')
			.where({user_id: userid, isprofile: 1})
			.del()
			.then(() => {
				date = Date.now();
				const image = {
					isprofile: 1,
					photo: ret,
					photoid: date+userid,
					user_id: req.session.user.id,
				};
				knex('photo')
					.insert(image)
					.then(() => { return (res.redirect('/photos')); })
					.catch((err) => {
						console.log(res.status(400).send(err));
						return (res.redirect('/'));
					})
			})
			.catch((err) => {
				console.log("failed to delete a photo");
				return (res.redirect('/editprofilepicture'));
			});
	}
	if (req.session.user.photocount <= 4) {
		knex('photo')
			.where({user: userid, isprofile: 1})
			.update({isprofile: 0})
			.then(() => {
				date = Date.now();
				const newimage = {
					isprofile: 1,
					photo: ret,
					photoid: date+userid,
					user_id: userid
				};
				knex('photo')
					.insert(newimage)
					.then(() => {
						console.log("new profile picture added");
						key = req.session.user.verifkey;
						pc = req.session.user.photocount + 1;
						req.session.user.photocount = pc;
						knex('user')
							.where({verifkey: key})
							.update({ photocount: pc })
							.then(() => {
								return (res.redirect('/photos'));
							})
							.catch((err) => {
								console.log("Something wrong when updating data!");
							})
					})
			}).catch((err) => {
				console.log("failed to update", err);
				return (res.redirect('/photos'));
			});
	}
}

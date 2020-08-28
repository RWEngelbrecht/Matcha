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

exports.postphoto = (req, res, next) => {
	date = Date.now();
	if (!req.file){
		req.flash('error_msg', 'You haven\'t selected a picture to upload!');
		return res.redirect('/photos');
	}
	const image = {
		photo: req.file.buffer.toString('base64'),
		photoid: date+req.session.user.username,
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
					req.flash('success_msg', 'Picture uploaded!');
					return (res.redirect('/photos'));
				})
				.catch((err) => { throw err; });
		}).catch((err) => {
			console.log(res.status(400).send(err));
			return (res.redirect('/'));
		 });
}

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
					photoid: date+req.session.user.username,
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
			.where({user_id: userid, isprofile: 1})
			.update({isprofile: 0})
			.then(() => {
				date = Date.now();
				const newimage = {
					isprofile: 1,
					photo: req.file.buffer.toString('base64'),
					photoid: date+req.session.user.username,
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

exports.postakephoto = (req, res, next) => {
    console.log("gettakephoto controller reached reached");
    date = Date.now();
    var ret = req.body.webcamimage.replace('data:image/png;base64,','');
    const image = {
        photo: ret,
        photoid: date+req.session.user.username,
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
					photoid: date+req.session.user.username,
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
			.where({user_id: userid, isprofile: 1})
			.update({isprofile: 0})
			.then(() => {
				date = Date.now();
				const newimage = {
					isprofile: 1,
					photo: ret,
					photoid: date+req.session.user.username,
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

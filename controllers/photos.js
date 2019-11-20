const User	= require('../models/umod');
const Photo	= require('../models/photos');
const path	= require('path');
const swig	= require('../app.js');
const crypto = require('crypto');
const { validationResult } = require("express-validator");

// GET photo landing page
exports.getphoto = (req, res, next) => {
	console.log("getphoto controller reached reached");
	let message = req.flash('Something went wrong, please try again later!');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
    }
    userphotocount = req.session.user.photocount;
	return (res.render(path.resolve('views/photos'), {photocount: userphotocount}));

}
// POST photo landing page
exports.postphoto = (req, res, next) => {
    date = Date.now();
    user = req.session.user.username
    tohash = toString(date) + toString(user);
    photoid = crypto.createHash('whirlpool').update(tohash).digest('hex');
    const image = new Photo({
        photo: req.file.buffer.toString('base64'),
        photoid: photoid,
        user: req.session.user._id,
    });
    image.save().then(item => {
        key = req.session.user.verifkey;
        pc = req.session.user.photocount + 1;
        req.session.user.photocount = pc;
        console.log("Photo Addition Successful")
        User.findOneAndUpdate({verifkey: key}, {$set:{photocount:pc}},function(err, doc){
            if(err){
                console.log("Something wrong when updating data!");
            }
            console.log("photocount updated successfully");
        });
        return (res.redirect('/'));
    }).catch(err => {
        console.log(res.status(400).send(err));
        return (res.redirect('/'));
    });
}
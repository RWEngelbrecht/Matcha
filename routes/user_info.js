const express	= require('express');
const router	= express.Router();
const update	= require('../controllers/user_info.js');
const { body }	= require('express-validator');
const multer= require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

// Update info landing page.
router.get('/updateinfo', update.updateinfo);
// Username update page.
router.get('/username', update.getusername);
router.post('/username', [
    body('new_username').trim(),
]
,update.postusername);
// Name & Surname updating page
router.get('/name', update.getname);
router.post('/name', [
    body('new_firstname').trim(),
    body('new_surname').trim(),
]
,update.postname);
// Age & Age Pref updating page
router.get('/age', update.getage);
router.post('/age', [
    body('new_age'),
    body('new_agelower'),
    body('new_ageupper'),
]
,update.postage);
// Maxdist updating page
router.get('/maxdist', update.getmaxdist);
router.post('/maxdist', [
    body('new_maxdist'),
]
,update.postmaxdist);
// Email updating page.
router.get('/email', update.getemail);
router.post('/email', [
    body('new_email', 'Please enter a valid email address').normalizeEmail(),
]
,update.postemail);
// Password updating page
router.get('/password', update.getpassword);
router.post('/password', [
    body('old_password').trim(),
    body('new_password', 'Password must have at least 8 characters alphanumeric').trim(),
    body('confirm_new_password').trim(),
]
,update.postpassword);
// About me updating page.
router.get('/about', update.getabout);
router.post('/about', [
    body('new_about'),
],
update.postabout);
// Update Location page
router.get('/location', update.getlocation);
router.post('/location', [
    body('new_postal'),
    body('new_city'),
    body('new_province'),
],
update.postlocation);
module.exports = router;
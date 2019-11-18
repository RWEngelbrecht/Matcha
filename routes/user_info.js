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
    body('new_username').isAlphanumeric().trim(),
]
,update.postusername);
// Name & Surname updating page
router.get('/name', update.getname);
router.post('/name', [
    body('new_firstname').isAlpha().trim(),
    body('new_surname').isAlpha().trim(),
]
,update.postname);
// Age & Age Pref updating page
router.get('/age', update.getage);
router.post('/age', [
    body('new_age').isNumeric(),
    body('new_agelower').isNumeric(),
    body('new_ageupper').isNumeric(),
]
,update.postage);
// Maxdist updating page
router.get('/maxdist', update.getmaxdist);
router.post('/maxdist', [
    body('new_maxdist').isNumeric(),
]
,update.postmaxdist);
// Email updating page.
router.get('/email', update.getemail);
router.post('/email', [
    body('new_email', 'Please enter a valid email address').isEmail().normalizeEmail(),
]
,update.postemail);

module.exports = router;
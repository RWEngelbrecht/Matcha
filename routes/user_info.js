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
module.exports = router;
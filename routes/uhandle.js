// REQUIRES.
const express	= require('express');
const router	= express.Router();
const uhandle	= require('../controllers/uhandle.js');
const { body }	= require('express-validator');
const multer= require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

console.log("uhandle reached(Routes)");
// HOME
router.get('/', uhandle.gethome);
// LOGIN
router.get('/login', uhandle.getlogin);
router.post('/login', [
	body('email', 'Please enter a valid email address').normalizeEmail(),
	body('password', 'Password must have at least 8 characters alphanumeric').trim()
],
uhandle.postlogin);
// REGISTER
router.get('/register', uhandle.getregister);
router.post('/register', upload.single('photo'), [
	body('email', 'Please enter a valid email address').normalizeEmail(),
	body('password', 'Password must have at least 8 characters alphanumeric').trim(),
	body('confirm_password', 'Password must have at least 8 characters alphanumeric').trim(),
	body('username').trim(),
	body('firstname').trim(),
	body('surname').trim(),
	body('age'),
	body('gender').trim(),
	body('gender_pref').trim(),
	body('photo'),
	body('dist'),
	body('about').trim(),
],
uhandle.postregister);
// CONFIRM EMAIL
router.get('/confirm', uhandle.getconfirm);
// LOGOUT
router.get('/logout', uhandle.getlogout);
// SEND RESET PASSWORD.
router.get('/resetpwd', uhandle.getresetpwd);
router.post('/resetpwd', [
	body('resetpwd_email', 'Please enter a valid email address').normalizeEmail(),
],
uhandle.postresetpwd);
// ACTUALLY RESET PASSWORD
router.get('/resetpassword', uhandle.getresetpassword);
router.post('/resetpassword', [
	body('confirm_email', 'Please enter a valid email address').normalizeEmail(),
	body('new_pass_forgot', 'Password must have at least 8 characters alphanumeric').trim(),
	body('confirm_new_pass_forgot', 'Password must have at least 8 characters alphanumeric').trim(),
],
uhandle.postresetpassword);
// // INTERESTS
router.get('/interests', uhandle.getinterests);
router.post('/interests', uhandle.postinterests);

router.get('/profile/:id',uhandle.getProfile);

module.exports = router;

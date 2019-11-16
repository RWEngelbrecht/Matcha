// REQUIRES.
const express	= require('express');
const router	= express.Router();
const uhandle	= require('../controllers/uhandle.js');
const { body }	= require('express-validator');
const multer= require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

console.log("uhandle reached(Routes)");
// user router.all so it can handle GET, POST and PUT requests,
// this way we dont have to have a controller for GET and POST seperately.
router.get('/', uhandle.gethome);

router.get('/login', uhandle.getlogin);
router.post('/login', [
	body('email', 'Please enter a valid email address').isEmail().normalizeEmail(),
	body('password', 'Password must have at least 8 characters alphanumeric').isAlphanumeric().trim().isLength({ min: 8})
],
uhandle.postlogin);

router.get('/register', uhandle.getregister);
router.post('/register', upload.single('photo'), [
	body('email', 'Please enter a valid email address').isEmail().normalizeEmail(),
	body('password', 'Password must have at least 8 characters alphanumeric').isAlphanumeric().trim().isLength({ min: 8}),
	body('confirm_password', 'Password must have at least 8 characters alphanumeric').isAlphanumeric().trim().isLength({ min: 8}),
	body('username').isAlphanumeric().trim(),
	body('firstname').trim(),
	body('surname').trim(),
	body('age').isNumeric(),
	body('gender').trim().isAlpha(),
	body('gender_pref').trim().isAlpha(),
	body('photo'),
	body('dist').isNumeric(),
	body('about').isAlphanumeric().trim(),
], 
uhandle.postregister);

module.exports = router;
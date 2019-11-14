// REQUIRES.
const express	= require('express');
const router	= express.Router();
const uhandle	= require('../controllers/uhandle.js');

console.log("uhandle reached(Routes)");

router.get('/', uhandle.home);

router.get('/login', uhandle.login);

router.get('/register', uhandle.register);

module.exports = router;
// REQUIRES.
const express	= require('express');
const router	= express.Router();
const uhandle	= require('../controllers/uhandle.js');

console.log("uhandle reached(Routes)");

router.get('/login', uhandle.login);

module.exports = router;
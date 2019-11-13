var express	= require('express');
var router	= express.Router();

router.get('/', function(req, res) {
	res.sendfile('matcha/templates/index.html');
	// sendfile should send a js file that can just display html
})


module.exports = router
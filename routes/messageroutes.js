const express	= require('express');
const router	= express.Router();
const messaage	= require('../controllers/messages.js');

router.get('/messages', messaage.getmessages);
router.post('/messages', messaage.postmessages);

module.exports = router;
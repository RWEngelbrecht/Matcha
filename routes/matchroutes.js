const express	= require('express');
const mrouter	= express.Router();
const umatch	= require('../controllers/umatch.js');
const path	= require('path');

mrouter.get('/matches', umatch.getMatches);
mrouter.post('/matches', umatch.like);
module.exports = mrouter;

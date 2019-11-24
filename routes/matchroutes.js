const express	= require('express');
const mrouter	= express.Router();
const umatch	= require('../controllers/umatch.js');
const path	= require('path');

mrouter.get('/matches', umatch.getMatchSuggestions);
mrouter.post('/matches', umatch.like);


//filtering
mrouter.get('/filter', umatch.getFilter);
mrouter.post('/filter', umatch.postFilter);

module.exports = mrouter;

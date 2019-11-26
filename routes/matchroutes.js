const express	= require('express');
const mrouter	= express.Router();
const umatch	= require('../controllers/umatch.js');
const path	= require('path');

mrouter.get('/suggestions', umatch.getMatchSuggestions);
mrouter.post('/suggestions', umatch.like);

mrouter.get('/matches', umatch.getMatches);

//filtering
mrouter.get('/filter', umatch.getFilter);
mrouter.post('/filter', umatch.postFilter);

module.exports = mrouter;

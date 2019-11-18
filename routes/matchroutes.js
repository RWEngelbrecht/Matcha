const express	= require('express');
const mrouter	= express.Router();
const umatch	= require('../controllers/umatch.js');
const path	= require('path');

console.log("matchroutes reached...");

mrouter.get('/matches', umatch.getMatches);

module.exports = mrouter;

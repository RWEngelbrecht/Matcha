// App Setup
const express	= require('express');
const app		= express();
const path		= require('path');
const server	= require('http').Server(app);

// Routes Requires
const index		= require('./matcha/routes/index.js');

// app.use is a way to register one or more instances of middleware
app.use(index);

// just tells you the app is running on port 8000
app.listen(8000, function () {
  console.log('Example app listening on port 8000!');
});

// Not sure if its necessary for now
module.exports = {
	app: app
}
// REQUIRES.
const express	= require('express');
const session	= require('express-session')
const path		= require('path');
const flash		= require('connect-flash');
const Mongodb	= require('connect-mongodb-session')(session);
const mongoose	= require('mongoose');
const swig		= require('swig');
const bodyParser= require('body-parser');
MONGODB_URI		= "mongodb+srv://Rigardt:80058024@cluster0-e6mik.mongodb.net/matcha";
const PasswordValidator = require('password-validator');
const app = express();

// APP SETUP.
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.use(session({ secret: 'matcha', resave: false, saveUninitialized: false}));
app.use(flash());
app.use(bodyParser.urlencoded({extended: false}));
session.user = 0;

// ROUTES
// const user = require('./routes/user');
const uhandle = require('./routes/uhandle');
const umatch = require('./routes/matchroutes');

// app.use(user);
app.use(uhandle);
app.use(umatch);

mongoose
	.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
	.then(result => {
		app.listen(8000);
	})
	.then(result => {
		console.log("Server has started, Sending it!");
	})
	.catch(err => {
		console.log(err)
	});

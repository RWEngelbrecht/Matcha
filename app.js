// REQUIRES.
const express	= require('express');
const session	= require('express-session')
const http		= require('http');
const mongoose	= require('mongoose');
const swig		= require('swig');
const bodyParser= require('body-parser');
const flash		= require('connect-flash');
// MONGODB_URI		= "mongodb+srv://Yano:80058024@cluster0-jszpy.mongodb.net/matcha";
MONGODB_URI		= "mongodb+srv://Rigardt:80058024@cluster0-e6mik.mongodb.net/matcha";

// APP SETUP.
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
module.exports = io;
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.use(session({ secret: 'matcha', resave: true, saveUninitialized: false}));
app.use(express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false, limit: '5mb'}));
session.user = 0;

var connections = [];
app.set('connections', connections);

// ROUTES
// const user = require('./routes/user');
const uhandle = require('./routes/uhandle');
const user_info = require('./routes/user_info');
const photo = require('./routes/photos');
const umatch = require('./routes/matchroutes');
const message = require('./routes/messageroutes');

app.use(flash());
app.use(function(req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
  });

app.use(uhandle);
app.use(user_info);
app.use(umatch);
app.use(photo);
app.use(message);

app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
  });

mongoose.set('useFindAndModify', false);
mongoose
.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(result => {
	server.listen(8000);
})
.then(result => {
	console.log(`Server has started, Port: 8000`);
})
.catch(err => {
	console.log(err)
});

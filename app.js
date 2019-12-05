// REQUIRES.
const express	= require('express');
const session	= require('express-session')
const path		= require('path');
const http		= require('http');
const flash		= require('connect-flash');
const Mongodb	= require('connect-mongodb-session')(session);
const mongoose	= require('mongoose');
const swig		= require('swig');
const bodyParser= require('body-parser');
MONGODB_URI		= "mongodb+srv://Yano:80058024@cluster0-jszpy.mongodb.net/matcha";
// MONGODB_URI		= "mongodb+srv://Rigardt:80058024@cluster0-e6mik.mongodb.net/matcha";

// APP SETUP.
const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.use(session({ secret: 'matcha', resave: true, saveUninitialized: false}));
app.use(flash());
app.use(express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false, limit: '5mb'}));
session.user = 0;

io.on('connection', () =>{
	console.log('IO Connection established')
});

// ROUTES
// const user = require('./routes/user');
const uhandle = require('./routes/uhandle');
const user_info = require('./routes/user_info');
const photo = require('./routes/photos');
const umatch = require('./routes/matchroutes');
const message = require('./routes/messageroutes');

app.use(uhandle);
app.use(user_info);
app.use(umatch);
app.use(photo);
// app.use(message);

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

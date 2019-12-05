var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
const Message	= require('../models/messages');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

var dbUrl = "mongodb+srv://Yano:80058024@cluster0-jszpy.mongodb.net/matcha";

// GETS METHOD
exports.getmessages = (req, res) => {
  Message.find({chatID: "ArataGeorgia"},(err, messages)=> {
    res.render(path.resolve('views/messages'), {messages: messages})
  });
};

// POST METHOD
exports.postmessages = (async (req, res) => {
  try{
    var message = new Message(req.body);

    var savedMessage = await message.save()
      console.log('saved');
    // so we can censor messages
    var censored = await Message.findOne({message:'badword'});
      if(censored)
        await Message.remove({_id: censored.id})
      else
        io.emit('message', req.body);
      res.sendStatus(200);
  }
  catch (error){
    res.sendStatus(500);
    return console.log('error',error);
  }
  finally{
    console.log('Message Posted')
  }

})

io.on('connection', () =>{
  console.log('a user is connected')
})

mongoose.connect(dbUrl ,{} ,(err) => {
  console.log('mongodb connected',err);
})

// var server = http.listen(3000, () => {
//   console.log('server is running on port', server.address().port);
// });
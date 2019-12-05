var path = require('path');
var http = require('http');
var io = require('socket.io')(http);
const Message	= require('../models/messages');

// GETS METHOD
exports.getmessages = (req, res) => {
  if (req.session.user === 0) {
		return (res.redirect('/login'));
  }
  // res.render(path.resolve('views/messages'))
  Message.find({chatID: "ArataGeorgia"},(err, messages)=> {
    console.log(messages);
    return res.render(path.resolve('views/messages'), {messages: messages})
  });
};

// POST METHOD
exports.postmessages = (async (req, res) => {
  try{
    // var from = req.session.user.username;
  //   var to = ;
  //   var chat = ;
    var value = req.body.message;
    var message = new Message({chatID: "ArataGeorgia", sentBy: 'Arata', sentTo: 'Georgia', message: value});
    message.save().then (function (result){
      console.log("message saved");
    });
  //   // so we can censor messages
  //   var censored = await Message.findOne({message:'badword'});
  //     if(censored)
  //       await Message.remove({_id: censored.id})
  //     else
    io.emit('message', req.body.message);
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

// var server = http.listen(3000, () => {
//   console.log('server is running on port', server.address().port);
// });
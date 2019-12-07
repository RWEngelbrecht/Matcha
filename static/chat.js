$(function(){
    // make connection.
    var socket = io.connect('http://localhost:8000');

    // buttons and inputs.
    var message = $("#message");
    var username = $("#username");
    var send_message = $("#send_message");
    var send_username = $("#send_username");
    var chatroom = $("#chatroom");

    // Emit a new message
    send_message.click(function() {
        socket.emit('new_message', {message: message.val()});
    });

    // Listen for a new message
    socket.on('new_message', (data) => {
        chatroom.append("<p style='color: white'>" + data.username + ": " +  data.message + "</p>");
    });

    // Emit a username
    send_username.click(function(){
        console.log("username changed to", username.val());
        socket.emit('change_username', {username: username.val()});
    });
});
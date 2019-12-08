$(function(){
    // make connection.
    var socket = io.connect('http://localhost:8000');
    console.log(socket);

    // buttons and inputs.
    var message = $("#message");
    var username = $("#username");
    var send_message = $("#send_message");
    var send_username = $("#send_username");
    var chatroom = $("#chatroom");
    var notifblock = $("#notifblock");

    // Emit a new message
    send_message.click(function() {
        socket.emit('new_message', {message: message.val(), socketID: socket.id});
    });

    // Listen for a new message
    socket.on('new_message', (data) => {
        chatroom.append("<p style='color: white'>" + data.username + ": " +  data.message + "</p>");
    });

    // Listen for a new message
    socket.on('new_notification', (data) => {
        notifblock.append("<div class='alert alert-danger alert-dismissible fade show' role='alert'>"
            + data.message + " " + data.user +
            "<button type='button' class='close' data-dismiss='alert' aria-label='close'><span aria=hidden='true'>&times;</span></span></button>"
            + "</div>");
    });

    // Emit a username
    send_username.click(function(){
        console.log("username changed to", username.val());
        socket.emit('change_username', {username: username.val()});
    });
});
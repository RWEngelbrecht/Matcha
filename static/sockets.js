$(function(){
    // make connection.
    var socket = io.connect('http://localhost:8000');

    // buttons and inputs.
    var message = $("#message");
    var username = $("#username");
    var send_message = $("#send_message");
    var send_username = $("#send_username");
    var chatroom = $("#chatroom");
    var notifblock = $("#notifblock");
    var login = $("#login");
    var email = $("#email");
    var chat = $("#chat");
    var joinChatID = $("#joinChatId");
    var sendChatID = $("#sendChatId");
    var chatFrom = $("#chatFrom");
    var chatTo = $("#chatTo");

    // Emit a new message
    send_message.click(function() {
        socket.emit('new_message', {message: message.val(), chatFrom: chatFrom.val(), chatTo: chatTo.val(), chatID: sendChatID.val()});
    });

    login.click(function() {
        console.log(email.val());
        socket.emit('login', {email: email.val()});
    })

    chat.click(function() {
        socket.emit('join_chat', {chatID: joinChatID.val()})
    })

    // Listen for a new message
    socket.on('new_message', (data) => {
        chatroom.append("<p style='color: white'>" + data.chatFrom + ": " +  data.message + "</p>");
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


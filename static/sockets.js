$(function(){
    // make connection.
    // buttons and inputs.
    var message = $("#message");
    var user = $("#is_user");
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
    var socket = io.connect();

    // Emit a new message
    send_message.click(function() {
        console.log("user val send message", user.val());
        // this sends the new client id, will change it to do that on reload of any page
        socket.emit('update', {user: user.val(), id: socket.id});
        socket.emit('new_message', {message: message.val(), chatFrom: chatFrom.val(), chatTo: chatTo.val(), chatID: sendChatID.val()});
    });

    login.click(function() {
        socket.emit('login', {email: email.val()});
    })

    // Listen for a new message
    socket.on('new_message', (data) => {
        console.log(data);
        chatroom.append("<p style='color: white'>" + data.username + ": " +  data.message + "</p>");
    });

    // Listen for a new notif
    socket.on('new_notification', (data) => {
        notifblock.append("<div class='alert alert-danger alert-dismissible fade show' role='alert'>"
            + data.message + " " + data.user +
            "<button type='button' class='close' data-dismiss='alert' aria-label='close'><span aria=hidden='true'>&times;</span></span></button>"
            + "</div>");
    });
});


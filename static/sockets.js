$(function(){
    // buttons and inputs for messaging.
    var chatFrom = $("#chatFrom");
    var chatTo = $("#chatTo");
    var send_message = $("#send_message");
    var message = $("#message");
	var chatroom = $("#chatroom");
	var chatRoomName = $("#sendChatId");

    // buttons and inputs for handling the morphing socket ids
    var user = $("#is_user");
    var login = $("#login");
    var email = $("#email");
    var like = $("#like");
    var liker = $("#liker");
    var potmatch = $("#potmatch");
    // buttons and inputs for the notifications
    var notifblock = $("#notifblock");
    // make connection.
    var socket = io.connect();
    socket.on('connect', () => update());
    function update() {
        socket.emit('update', {user: user.val(), id: socket.id});
    }

    // Emit a new message
    send_message.click(function() {
        console.log("user val send message", user.val());
        // this sends the new client id, will change it to do that on reload of any page
        socket.emit('update', {user: user.val(), id: socket.id});
        socket.emit('new_message', {message: message.val(), chatFrom: chatFrom.val(), chatTo: chatTo.val(), chatID: [chatTo.val(), chatFrom.val()].sort().join('-')});
    });

    // create a tracker for a user on login
    login.click(function() {
        socket.emit('update', {user: user.val(), id: socket.id});
        socket.emit('login', {email: email.val()});
    })
    // Listen for a new message
    socket.on('new_message', (data) => {
		if (data.chatID.includes(data.username) && chatRoomName.val() === data.chatID)
			chatroom.append("<p style='color: white'>" + data.username + ": " +  data.message + "</p>");
    });

    // Send notif info on a like click to server
    like.click(function() {
        socket.emit('update', {user: user.val(), id: socket.id});
        console.log("liker value -->", liker.val());
        socket.emit('new_like', {liked: potmatch.val(), liker: liker.val()});
    }) 

    // Listen for a new notif
    socket.on('new_notification', (data) => {
        notifblock.append("<div class='alert alert-danger alert-dismissible fade show' role='alert'>"
            + data.message + " " + data.user +
            "<button type='button' class='close' data-dismiss='alert' aria-label='close'><span aria=hidden='true'>&times;</span></span></button>"
            + "</div>");
    });
});


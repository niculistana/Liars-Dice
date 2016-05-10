//Need to find a way to append gameId to chat_channel
//Maybe create another file just for Pusher related things

function getTime() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    return "(" +hours + ":" + minutes + ")";
}

setTimeout(function(){
    console.log(gameId);
    channel = pusher.subscribe("chat_channel"+gameId);
    channel.bind('chat', chat);
}, 1000);

function chat(data) {
    var name = $("<span>").addClass("name").text(data.name+getTime()+":");
    var message = $("<span>").addClass("chat-message").text(" "+data.message);
    var chatPost = $("<div>").addClass("message").append(name).append(message);
    $('#messages').append(chatPost);
    $('#messages').scrollTop($('#messages').scrollTop()+$('#messages').height());
}

$(document).keypress(function(event){
    if(event.keyCode === 13) {
        submitMessage();
    }
});

function submitMessage() {
    if($('#chatInput').val() !== ""){
        //Chat implementation
        var chatMessage = {
            chatMessage: $('#chatInput').val()
        }
        $('#chatInput').val('');
        $.ajax({
            type: 'POST',
            url: "/chat/message",
            data: chatMessage,
            dataType: 'json',
            success: function (data) {
                console.log("I succeed");
            },
            error: function(xhr, err, errThrown) {
                console.log(err);
                console.log(errThrown);
            }
        });
    }
}
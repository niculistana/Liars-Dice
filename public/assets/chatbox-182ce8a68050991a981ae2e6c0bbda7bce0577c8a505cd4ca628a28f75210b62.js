function getTime(){var e=new Date,s=e.getHours(),a=e.getMinutes();return"("+s+":"+a+")"}function chat(e){var s=$("<span>").addClass("name").text(e.name),a=$("<span>").addClass("chat-message").text(getTime()+": "+e.message),t=$("<div>").addClass("message").append(s).append(a);$("#messages").append(t),$("#messages").scrollTop($("#messages").scrollTop()+$("#messages").height())}function playerAdd(e){var s=$("<span>").addClass("name").text(e.name),a=$("<span>").addClass("chat-message").text(" has joined the game"),t=$("<div>").addClass("message").append(s).append(a);$("#messages").append(t),$("#messages").scrollTop($("#messages").scrollTop()+$("#messages").height())}function submitMessage(){if(""!==$("#chatInput").val()){var e={chatMessage:$("#chatInput").val()};$("#chatInput").val(""),$.ajax({type:"POST",url:"/chat/message",data:e,dataType:"json",success:function(){console.log("I succeed")},error:function(e,s,a){console.log(s),console.log(a)}})}}$(document).keypress(function(e){13===e.keyCode&&submitMessage()});
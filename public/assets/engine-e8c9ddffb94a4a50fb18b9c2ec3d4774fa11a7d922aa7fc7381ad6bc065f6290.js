function bid(){$.get("/session/user_id/",function(e){var n=e.uid;$.get("/session/recent_user_name/"+n,function(e){var t=(e.uname,{game:{quantity:parseInt($("#dieQuantity").text()),value:parseInt($("#dieValue").text()),prev_player_id:n}});$.post("/games/"+gameId+"/bid",t,function(e){testButtonText.text=e.bad_response})})})}function incrementDieValue(){console.log("+1 value");var e=parseInt($("#dieValue").text());6>e&&$("#dieValue").text(e+1)}function incrementDieQuantity(){console.log("+1 quantity");var e=parseInt($("#dieQuantity").text());e<globalDiePool.allObjects.length&&$("#dieQuantity").text(e+1)}function decrementDieValue(){console.log("-1 value");var e=parseInt($("#dieValue").text());e>1&&$("#dieValue").text(e-1)}function decrementDieQuantity(){console.log("-1 quantity");var e=parseInt($("#dieQuantity").text());e>1&&$("#dieQuantity").text(e-1)}function challenge(){$.get("/session/user_id/",function(e){var n=e.uid;$.get("/session/recent_user_name/"+n,function(e){var t=e.uname,s={game:{uname:t,uid:n}};$.post("/games/"+gameId+"/challenge",s,function(e){console.log(e)})})})}function joinLobby(){$.get("/session/user_id/",onSuccessJoin)}function leaveLobby(){$.get("/session/user_id/",onSuccessLeave)}function onSuccessJoin(e){var n=e.uid,t={game_user:{game_id:gameId,user_id:n}};$.post("/game_users/",t,function(e){if("fail"!=e.response&&"disconnect"!=e.response)$.post("/games/join/"+gameId,{logged_in_users:1});else if("disconnect"===e.response){$.get("/session/user_id/",onSuccessGetDice);for(var n=0;n<e.users_len;n++)playerPool.addPlayer(new Player("",n));logo.destroy(),playerSpriteGroup.renderSprites("octagonal")}})}function onSuccessLeave(e){var n=e.uid,t={_method:"DELETE",game_user:{user_id:n}};$.post("/game_users/"+n,t)}function startGame(){$.get("/session/name_id/",onSuccessStartGame)}function onSuccessStartGame(e){var n=e.id,t=e.name,s={game:{name:t,round:0,state:1}};$.post("/games/"+n+"/start_game",s)}function onSuccessGetDice(e){var n=e.uid,t={game_user:{game_id:gameId,user_id:n}};$.post("/game_users/show_dice/",t,function(e){var n=e.hand.split(",");playerStash.allObjects=n,dieStashGroup.renderSprites("box"),console.log(e.hand)})}function startRound(){$.get("/session/user_id/",onSuccessGetDice),$.get("/session/name_id/",onSuccessStartRound)}function onSuccessStartRound(e){var n=e.id;$.get("/games/"+n+".json",function(e){var t=e.round;t+=1;var s={game:{round:t,quantity:0,value:0}};$.post("/games/"+n+"/start_round",s)})}function endGame(){$.get("/session/name_id/",onSuccessEndGame)}function onSuccessEndGame(e){var n=e.id;$.get("/session/game_winner_id/",function(e){var t=e.user_id,s={game:{state:2,winner_id:t}};$.post("/games/"+n+"/end_game/",s)})}
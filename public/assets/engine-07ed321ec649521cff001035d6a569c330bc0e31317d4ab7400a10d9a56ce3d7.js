function bid(){$.get("/session/user_id/",function(e){var t=e.uid;$.get("/session/recent_user_name/"+t,function(e){var n=(e.uname,{game:{quantity:parseInt($("#dieQuantity").text()),value:parseInt($("#dieValue").text()),prev_player_id:t}});$.post("/games/"+gameId+"/bid",n,function(e){testButtonText.text=e.bad_response})})})}function incrementDieValue(){console.log("+1 value");var e=parseInt($("#dieValue").text());6>e&&$("#dieValue").text(e+1)}function incrementDieQuantity(){console.log("+1 quantity");var e=parseInt($("#dieQuantity").text());e<globalDiePool.allObjects.length&&$("#dieQuantity").text(e+1)}function decrementDieValue(){console.log("-1 value");var e=parseInt($("#dieValue").text());e>1&&$("#dieValue").text(e-1)}function decrementDieQuantity(){console.log("-1 quantity");var e=parseInt($("#dieQuantity").text());e>1&&$("#dieQuantity").text(e-1)}function challenge(){$.get("/session/user_id/",function(e){var t=e.uid;$.get("/session/recent_user_name/"+t,function(e){var n=e.uname,s={game:{uname:n,uid:t}};$.post("/games/"+gameId+"/challenge",s,function(e){console.log(e)})})})}function joinLobby(){$.get("/session/user_id/",onSuccessJoin)}function leaveLobby(){$.get("/session/user_id/",onSuccessLeave)}function onSuccessJoin(e){var t=e.uid,n={game_user:{game_id:gameId,user_id:t}};$.post("/game_users/",n,function(e){if("fail"!=e.response&&"disconnect"!=e.response)$.post("/games/join/"+gameId,{logged_in_users:1});else if("disconnect"===e.response){$.get("/session/user_id/",onSuccessGetDice);for(var t=0;t<e.users_len;t++)playerPool.addPlayer(new Player("",t));logo.destroy(),playerSpriteGroup.renderSprites("octagonal")}})}function onSuccessLeave(e){var t=e.uid,n={_method:"DELETE",game_user:{user_id:t}};$.post("/game_users/"+t,n)}function startGame(){$.get("/session/name_id/",onSuccessStartGame)}function onSuccessStartGame(e){var t=e.id,n=e.name,s={game:{name:n,round:0,state:1}};$.post("/games/"+t+"/start_game",s)}function onSuccessGetDice(e){var t=e.uid,n={game_user:{game_id:gameId,user_id:t}};$.post("/game_users/show_dice/",n,function(e){var t=e.hand.split(",");playerStash.allObjects=t,dieStashGroup.renderSprites("box"),console.log(e.hand)})}function startRound(){$.get("/session/user_id/",onSuccessGetDice),$.get("/session/name_id/",onSuccessStartRound)}function onSuccessStartRound(e){var t=e.id;$.get("/games/"+t+".json",function(e){var n=e.round;n+=1;var s={game:{round:n,quantity:0,value:0}};$.post("/games/"+t+"/start_round",s)})}function endGame(){$.get("/session/name_id/",onSuccessEndGame)}function onSuccessEndGame(e){var t=e.id;$.get("/session/game_winner_id/",function(e){var n=e.user_id,s={game:{state:2,winner_id:n}};$.get("/session/user_id",function(e){currentPlayerId=e.uid,currentPlayerId==n&&(emitter=game.add.emitter(game.world.centerX,250,200),emitter.makeParticles("dollars"),emitter.setRotation(0,0),emitter.setAlpha(.3,.8),emitter.setScale(.5,1),emitter.gravity=0,emitter.start(!1,4e3,20),setTimeout(function(){emitter.destroy(),waitGame()},2e4))}),$.post("/games/"+t+"/end_game/",s)})}
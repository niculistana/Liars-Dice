//Behavior to bet
function bid() {
    $.get('/session/user_id/', function(event){
        var playerId = event.uid;
        $.get('/session/recent_user_name/'+playerId, function(event) {
            var playerUsername = event.uname;
            var bid_info = {
                game: {
                    quantity: parseInt($('#dieQuantity').text()),
                    value: parseInt($('#dieValue').text()),
                    prev_player_id: playerId
                }
            };
            $.post('/games/'+gameId+'/bid', bid_info, function(event){
                //Handle if user fucked up
                testButtonText.text = event.bad_response;
            });
        });
    });
}

/*** Bidding methods ***/
function incrementDieValue() {
    console.log("+1 value");
    var update = parseInt($('#dieValue').text());
    if(update < 6)
        $('#dieValue').text(update+1);
}

function incrementDieQuantity() {
    console.log("+1 quantity");
    var update = parseInt($('#dieQuantity').text());
    if(update < globalDiePool.allObjects.length)
        $('#dieQuantity').text(update+1);
}

function decrementDieValue() {
    console.log("-1 value");
    var update = parseInt($('#dieValue').text());
    if(update > 1)
        $('#dieValue').text(update-1);
}

function decrementDieQuantity() {
    console.log("-1 quantity");
    var update = parseInt($('#dieQuantity').text());
    if(update > 1)
        $('#dieQuantity').text(update-1);
}

function challenge() {
    $.get('/session/user_id/', function(event){
        var playerId = event.uid;
        $.get('/session/recent_user_name/'+playerId, function(event) {
            var playerUsername = event.uname;
            var challenge_info = {
                game: {
                    uname: playerUsername,
                    uid: playerId
                }
            };
            $.post('/games/'+gameId+'/challenge', challenge_info, function(event) {
                console.log(event);
            });
        });
    });
}

/*** End bidding methods ***/

/*** lobby methods ***/
function joinLobby () {
    $.get('/session/user_id/', onSuccessJoin);
}

function leaveLobby () {
    $.get('/session/user_id/', onSuccessLeave);
}

function onSuccessJoin (event) {
    var playerId = event.uid;
    // var playerDice = event.dice;
    var game_user_info = {
        game_user : {
            game_id: gameId,
            user_id: playerId
            // dice: playerDice
        }
    };
    $.post('/game_users/', game_user_info, function(event){
        if(event.response != "fail" && event.response != "disconnect")
            $.post('/games/join/'+gameId, {logged_in_users: 1});
        else if (event.response === "disconnect") {
            //Re-render on disconnect and coming back
            $.get('/session/user_id/', onSuccessGetDice);
            for(var player = 0; player<event.users_len; player++) {
                playerPool.addPlayer(new Player("", player));
            }
            logo.alpha = 0;
            playerSpriteGroup.renderSprites("octagonal");
        }
    });
}

function onSuccessLeave(event) {
    var playerId = event.uid;
    // var playerDice = event.dice;
    var game_user_info = {
        _method: "DELETE",
        game_user : {
            // game_id: gameId,
            user_id: playerId
            // dice: playerDice
        }
    };
    $.post('/game_users/'+playerId, game_user_info);
}
/*** end lobby methods ***/

/*** game state methods ***/
function startGame() {
    $.get('/session/name_id/', onSuccessStartGame);
}

function onSuccessStartGame(event) {
    var gameId = event.id;
    var gameName = event.name;
    var game_start_info = {
        game: {
            name: gameName,
            round: 0,
            state: 1
        }
    };
    $.post('/games/'+gameId+'/start_game', game_start_info);
}

function onSuccessGetDice(event) {
    var playerId = event.uid;
    var game_user_info = {
        game_user : {
            game_id: gameId,
            user_id: playerId
        }
    };
    $.post('/game_users/show_dice/', game_user_info, function(event){
        //Render dice
        var hand = event.hand.split(",");
        playerStash.allObjects = hand;
        dieStashGroup.renderSprites("box");
        console.log(event.hand);
    });
}

function startRound() {
    $.get('/session/user_id/', onSuccessGetDice);
    $.get('/session/name_id/', onSuccessStartRound);
}

function onSuccessStartRound(event) {
    var gameId = event.id;
    $.get('/games/'+gameId+'.json', function(event) {
        var roundCount = event.round;
        roundCount+=1;
        var round_start_info = {
            game: {
                round: roundCount,
                quantity: 0,
                value: 0
            }
        };
        $.post('/games/'+gameId+'/start_round', round_start_info);
    });
}

function endGame() {
    // switch turns to the next least recently updated person
    $.get('/session/name_id/', onSuccessEndGame);
}

function onSuccessEndGame(event) {
    var gameId = event.id;
    $.get('/session/game_winner_id/', function(event) {
        var game_winner_id = event.user_id;
        var game_end_info = {
            game: {
                state: 2,
                winner_id: game_winner_id
            }
        };
        $.post('/games/'+gameId+'/end_game/', game_end_info);
    });
}
/*** end game state methods ***/
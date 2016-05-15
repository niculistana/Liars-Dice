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
                    name: playerUsername, 
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
                    name: playerUsername,
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
    $.post('/game_users/', game_user_info);
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
    $.get('/session/user_id/', onSuccessGetDice);
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

function endRound() {
    // broadcast using pusher(render_round_end):
        // broadcast who lost a die this round
        // move on to the next round
}

function startTurn() {
    $.get('/session/name_id/', onSuccessStartTurn);
    // switch turns to the next least recently updated person
    // broadcast using pusher (render_turn_start)
        // broadcast who's turn it is
    // restart turn clock
}

function onSuccessStartTurn(event) {
    var gameId = event.id;
    $.get('/session/game_turn_id/', function(event) {
        var turnId = event.turn;
        var turn_start_info = {
            game: {
                turn: turnId
            }
        };
        $.post('/games/'+gameId+'/start_turn/', turn_start_info);
    });
}

function endTurn() {
    $.get('/session/name_id/', onSuccessEndTurn);
    // switch turns to the next least recently updated person
    // broadcast using pusher (render_turn_end):
        // broadcast who's upcoming turn it is
}

function endGame() {
    // switch turns to the next least recently updated person
}

function onSuccessEndTurn(event) {
    var gameId = event.id;
    $.get('/session/game_user_ids/', function(event) {
        var turnIds = event.turn;
        newTurn = turnIds.substring(2,turnIds.length) + "," + turnIds.charAt(0);
        var turn_end_info = {
            game: {
                turn: newTurn
            }
        };
        $.post('/games/'+gameId+'/end_turn/', turn_end_info);
    });
    // broadcast using pusher (render_turn_end):
        // broadcast the winner
        // broadcast game over
}

function onSuccessEndGame() {
    // backend:
        // set state to 2 (finished)
        // increment winner leaderboard
    // broadcast using pusher (render_turn_end):
        // broadcast the winner
        // broadcast game over
}
/*** end game state methods ***/

//Behavior when player loses a challenge and then loses a dice
function loseDice() {
    diePool.removeDie(0);
    var loseDiceAjax = {
        _method: 'PUT',
        game: {
            name: gameName,
            turn: "1",
            diepool: [],
            completed: 1
        }
    };
    for(var die in diePool.allObjects) {
        loseDiceAjax.game.diepool.push(diePool.allObjects[die].id);
    }
    loseDiceAjax.game.diepool = JSON.stringify(loseDiceAjax.game.diepool);
    $.ajax({
        url: '/games/'+gameId,
        type: 'POST',
        data: loseDiceAjax,
        success: function(response) {
            console.log("I have put");
        }
    });
    dieGroup.removeAll();
    dieSpriteGroup.renderSprites("box");
    testButtonText.text = "removeDie";
}

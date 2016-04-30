// var numPlayers = 0;
// var players = [];
// var assetsLoaded = false;
// var hasWinner = false;

// loop until engine(game).numPlayers = 4
function isRoomFull() {
    if (numPlayers === 4) {
        return true;
    } else {
        return false;
    }
}

// once done, update engine(game).assetsLoaded == true
function isLoaded() {
    if (assetsLoaded) {
        return true;
    } else {
        return false;
    }
}

// loop until engine(game).hasWinner == true
function isContinue() {
    if (hasWinner) {
        return true;
    } else {
        return false;
    }
}

function isRoomReady() {

}

// update diePool depending on engine(game) rules...
function updateGlobalPool(game) {
  
}

//Make ajax request to get id before making post request?/?
function readyButton() {
    $.ajax({
        url: '/session/user_id/',
        type: 'GET',
        dataType: 'json',
        success: function(event) {
            var userId = event.uid;
            console.log(event);
            var game_user_info = {
                _method: 'PUT',
                game_user : {
                    game_id: parseInt(gameId),
                    user_id: userId,
                    is_ready: true
                }
            };
            $.ajax({
                url: '/game_users/'+userId,
                type: 'POST',
                dataType: 'json',
                data: game_user_info,
                success: function(event) {
                    console.log(event);
                }
            });
        }
    });
    
}

function notReady() {
       $.ajax({
        url: '/session/user_id/',
        type: 'GET',
        dataType: 'json',
        success: function(event) {
            var userId = event.uid;
            console.log(event);
            var game_user_info = {
                _method: 'PUT',
                game_user : {
                    game_id: parseInt(gameId),
                    user_id: userId,
                    is_ready: false
                }
            };
            $.ajax({
                url: '/game_users/'+userId,
                type: 'POST',
                dataType: 'json',
                data: game_user_info,
                success: function(event) {
                    console.log(event);
                }
            });
        }
    });
}

function bid() {

}

function challenge() {

}

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

function revealDice() {

}

//Keep a count of how many dice each player should get
//Then make a post to the server about each player's dice
function dealDice() {
    
}
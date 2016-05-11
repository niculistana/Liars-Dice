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

//Behavior to bet
//Get quantity and value from DOM
function bid() {
    var bid_info = {
        game: {
            quantity: 3,
            value: 5
        }
    };
    $.post('/games/'+gameId+'/bid', bid_info, function(event){
        //Handle if user fucked up
    })
}

function challenge() {
    var challenge_info = {
        game: {
            challenger: "name",
            challengee: "name2",
        }
    };
    $.post('/games/'+gameId+'/challenge', challenge_info, function(event) {
        console.log(event);
    })
}

// lobby methods
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
// end lobby methods

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

//Behavior to reveal dice
function revealDice() {

}

//Keep a count of how many dice each player should get
//Then make a post to the server about each player's dice
function dealDice() {
    
}
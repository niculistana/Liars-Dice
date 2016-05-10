// the client... the player
var diceAssignment = {
    0: [0, 4],
    1: [5, 9],
    2: [10, 14],
    3: [15, 19]
}

//This object should only do the rendering
function Player (timeLimit, playerName, playerID) {
    this.playerTurnTime = timeLimit;
    //Maybe bet function changes value of dice instead of keeping
    //track of diceHand separately
    this.playerDice = null;
    this.playerID = playerID;
    this.playerNameText = playerName;
    this.score = 0;
    this.playerBet = {
        "quantity": 1,
        "value": 1
    }
    this.currentState = "Playing";

    //What can each player do, in terms of UI

    this.getDice = function (diePool) {
        //Since we know the playerID, we assign the range to get the dice
        //For ex. player 1 will get dice 0-4, p2 gets dice 5-9
        this.playerDice = [];
        for(var i = diceAssignment[playerID][0]; i<=diceAssignment[playerID][1]; i++) {
            this.playerDice.push(diePool[i]);
        }
    }

    //Edit the bet
    this.bet = function (quantity, value) {
        this.playerBet.quantity = quantity;
        this.playerBet.value = value;
        //Change UI according to the bet. Maybe make a display bet function?
    }
    //Challenge someone
    this.challengePlayer = function (playerName) {
        //Do UI logic where playerName is challenged by challenger player
        console.log("Player "+this.playerNameText+" challenged "+playerName);
    }
    //Keep track if player is still in?
    this.changePlayerState = function (state) {
        this.currentState = state;
        //Change DOM to reflect whether the player is in, out, won, or lost
    }

    this.loseDice = function () {
        this.playerDice.splice(0,1);
        //Change DOM to reflect loss of dice
    }

    this.displayHand = function () {
        //Display dice to the DOM
        var dieText = "";
        for (var i = 0; i<this.playerDice.length; i++) {
            dieText += " " + this.playerDice[i].value;
        }
        console.log("The player's hand is: "+dieText);
    }
};
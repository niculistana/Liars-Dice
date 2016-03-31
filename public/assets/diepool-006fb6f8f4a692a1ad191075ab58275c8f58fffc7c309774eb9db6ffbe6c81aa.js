function diePool (numPlayers) {
  this.numPlayers = numPlayers;
  this.allDice = [];

  // default number of dice per player is 5
  this.generatePool = function() {
    for (var i = 0; i <= numPlayers*5; i++) {
      this.allDice.push(new Die(Math.ceil(Math.random()*6)));
    }
  };

  this.getCurrentDiePool = function () {
    return this.allDice;
  };

  this.setCurrentCurrentDie = function (index) {
  };

  this.removeDie = function (index) {
    this.allDice[index].value = 0;
  };

  this.resetDiePool = function () {
    //this.allDice.fill(new Dice(0));
    this.allDice = [];
  };

}

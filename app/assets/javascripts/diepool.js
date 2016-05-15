// a dice array api used by spritegroup to render sprites
function diePool () {
  this.numDice = 0;  // get currently logged-in users in db
  this.allObjects = [];

  // default number of dice per player is 5
  this.generatePool = function(numPlayers) {
    for (var i = 0; i < numPlayers*5; i++) {
      this.allObjects.push(Math.ceil(Math.random()*6));
    }
  };

  this.addDie = function (die) {
    this.allObjects.push(die);
  };

  this.emptyDiePool = function () {
    this.allObjects = [];
  };
}
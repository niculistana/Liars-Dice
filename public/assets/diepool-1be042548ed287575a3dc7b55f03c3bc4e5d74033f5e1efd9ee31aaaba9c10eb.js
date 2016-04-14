function diePool (numPlayers) {
  this.numPlayers = numPlayers;
  this.allObjects = [];

  // default number of dice per player is 5
  this.generatePool = function() {
    for (var i = 0; i < numPlayers*5; i++) {
      this.allObjects.push(new Die(Math.ceil(Math.random()*6)));
    }
  };

  this.setCurrentCurrentDie = function (index, die) {
    this.allObjects[index] = die;
  };

  this.removeDie = function (index) {
    if (index > -1) {
      this.allObjects.splice(index, 1);
    }
  };

  this.emptyDiePool = function () {
    this.allObjects = [];
  };

  this.resetDiePool = function () {
    this.emptyDiePool();
    this.generatePool();
  };

  this.shuffleDice = function () {
    for (var i = this.allObjects.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = this.allObjects[i];
      this.allObjects[i] = this.allObjects[j];
      this.allObjects[j] = temp;
    }
  };

}

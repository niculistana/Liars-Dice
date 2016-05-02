function playerPool (numPlayers) {
  this.numPlayers = numPlayers;
  this.allObjects = [];

  // default number of dice per player is 5
  this.generatePool = function() {
    for (var i = 0; i < numPlayers; i++) {
      this.allObjects.push(i);
    }
  };

  this.setCurrentCurrentplayer = function (index, player) {
    this.allObjects[index] = player;
  };

  this.removePlayer = function (index) {
    if (index > -1) {
      this.allObjects.splice(index, 1);
    }
  };

  this.emptyPlayerPool = function () {
    this.allObjects = [];
  };

  this.resetPlayerPool = function () {
    this.emptyplayerPool();
    this.generatePool();
  };
}
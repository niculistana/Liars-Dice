function SpriteGroup (spriteName, spriteGroup, objectPool, spriteOriginPosX, spriteOriginPosY) {
  this.spriteName = spriteName;
  this.spriteGroup = spriteGroup;
  this.spriteOriginPosX = spriteOriginPosX;
  this.spriteOriginPosY = spriteOriginPosY;
  this.lastSprite;

  // array of hashes, coordinate points for octagon
  this.octagonCoordinates = [{x:0, y:0},{x:280, y:180},{x:280, y:-180},
                            {x:-280, y:-180},{x:-280, y:180},{x:280, y:0},
                            {x:-280, y:0},{x:0, y:230},{x:0, y:-230}];

  this.renderSprites = function (shape) {
    var spriteFileName = "";
    var spritePosX;
    var spritePosY;

    // todo: renders in an octagonal fashion
    if (shape == "octagonal") {
      for (var i = 1; i < objectPool.allObjects.length+1; i++) {
        spriteFileName = spriteName + i;
        spritePosX = this.octagonCoordinates[i].x + spriteOriginPosX;
        spritePosY = this.octagonCoordinates[i].y + spriteOriginPosY;
        this.lastSprite = game.add.sprite(spritePosX, spritePosY, spriteFileName);
        spriteGroup.add(this.lastSprite);
      }
    }

    // renders in a box like fashion
    if (shape == "box") {
      spritePosX = spriteOriginPosX;
      spritePosY = spriteOriginPosY;
      for (var i in objectPool.allObjects) {
        if (objectPool.allObjects[i] > 0) {
          spriteFileName = spriteName + objectPool.allObjects[i];
          this.lastSprite = game.add.sprite(spritePosX, spritePosY, spriteFileName);
          spriteGroup.add(this.lastSprite);
          spritePosX+=100;
          if (i % 5 === 4) {
            spritePosY+= 100;
            spritePosX = spriteOriginPosX;
          }
        }
      }
    }
  };
}
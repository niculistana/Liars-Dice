function SpriteGroup (spriteName, spriteGroup, objectPool, numSprite, spriteOriginPosX, spriteOriginPosY) {
  this.spriteName = spriteName;
  this.spriteGroup = spriteGroup;
  this.numSprite = numSprite;
  this.spriteOriginPosX = spriteOriginPosX;
  this.spriteOriginPosY = spriteOriginPosY;

  this.renderSprites = function (shape) {
    var spriteFileName = "";
    var spritePosX = spriteOriginPosX;
    var spritePosY = spriteOriginPosY;

    // todo: renders in an octagonal fashion

    // renders in a box like fashion
    if (shape == "box") {
      console.log(objectPool.allObjects.length);
      for (var index in objectPool.allObjects) {
        if (objectPool.allObjects[index].id > 0) {
          spriteFileName = spriteName + objectPool.allObjects[index].id;
          spriteGroup.add(game.add.sprite(spritePosX, spritePosY, spriteFileName));
          spritePosX += 100;
          if (index % 5 === 4) {
            spritePosY+= 100;
            spritePosX = spriteOriginPosX;
          }
        }
      }
    }
  };
}
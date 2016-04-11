function SpriteGroup (spriteName, spriteGroup, numSprite, spriteOriginPosX, spriteOriginPosY) {
  this.spriteName = spriteName;
  this.spriteGroup = spriteGroup;
  this.numSprite = numSprite;
  this.spriteOriginPosX = spriteOriginPosX;
  this.spriteOriginPosY = spriteOriginPosY;

  this.renderSprites = function () {
    var spriteFileName = "";
    var spritePosX = spriteOriginPosX;
    var spritePosY = spriteOriginPosY;

    for (var i=1; i <= numSprite; i++) {
      spriteFileName = spriteName + i;
      spriteGroup.add(game.add.sprite(spritePosX, spritePosY, spriteFileName));
      spritePosX += 100;
    }
  };
}
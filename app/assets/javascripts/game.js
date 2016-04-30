var game = new Phaser.Game(740, 600, Phaser.AUTO, 'phaser-window', { preload: preload, create: create });
var assetsLoaded = false;
var hasWinner = false;
var logo;
var text;
var state;
var diePool;

var channel;
var gameId = "";
var gameName = "";
var gameFileKeys = ['dollars', 'logo', 'dice1', 'dice2', 'dice3', 'dice4', 'dice5', 'dice6']
var gameFiles = ['sprites/dollar_sign.png', 'sprites/liars_dice_logo.png',
'sprites/boardgamepack/PNG/Dice/dieRed1.png', 'sprites/boardgamepack/PNG/Dice/dieRed2.png', 
'sprites/boardgamepack/PNG/Dice/dieRed3.png', 'sprites/boardgamepack/PNG/Dice/dieRed4.png', 
'sprites/boardgamepack/PNG/Dice/dieRed5.png', 'sprites/boardgamepack/PNG/Dice/dieRed6.png', ];

// temporary button groups
var testButtonGroup;
var sceneButtonGroup;

// ui groups

var gameRoundGroup;
var gameNameGroup;
var gameTimeGroup;
var gameModeGroup;
var playerProfileGroup;

var gameControlsGroup;
var gameMenuGroup;
var playerDiceGroup;

// timeouts for scenes
var numPlayersTimeout;
var assetsLoadedTimeout;
var hasWinnerTimeout;

// function Game(){
//     this.numPlayers = numPlayers;
// }

function preload() {
    //For production, we change the url to intense-temple
    game.load.baseURL = "http://localhost:3000/";
    game.load.path = "assets/";
    game.load.spritesheet('rect_buttons', 'sprites/uipack_fixed/new_ui/buttons/rect_buttons.png', 192, 49);
    game.load.spritesheet('square_buttons', 'sprites/uipack_fixed/new_ui/buttons/square_buttons.png', 51, 49);
    game.load.images(gameFileKeys, gameFiles);
    diePool = new diePool(4);
    diePool.generatePool();
}

$(document).ready(function(event){
    $.ajax({
        url: '/session/name_id',
        type: 'GET',
        dataType: 'json',
        success: function(event) {
            gameId = event.id.toString();
            gameName = event.name;
            channel = pusher.subscribe("game_channel"+gameId);
            channel.bind('my_event', function(data) {
                console.log("I have made my move");
            });
        }
    });
});

function create() {
    game.stage.backgroundColor = "#fff";

    logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');

    logo.anchor.setTo(0.5, 0.5);
    logo.alpha = 0;

    game.add.tween(logo).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
    debugText = game.add.text(game.world.centerX, game.world.centerY, "",{ font: "12px Arial", fill: "#ff0044", align: "left" });
    testButtonText = game.add.text(game.world.centerX, game.world.centerY, "",{ font: "12px Arial", fill: "#ff0044", align: "left" });
    diePoolText = game.add.text(game.world.centerX, game.world.centerY, "",{ font: "12px Arial", fill: "#ff0044", align: "center", wordWrap: true, wordWrapWidth: 100 });
    playerText = game.add.text(game.world.centerX, game.world.centerY, "",{ font: "12px Arial", fill: "#ff0044", align: "center", wordWrap: true, wordWrapWidth: 100 });

    debugText.fixedToCamera = true;
    debugText.cameraOffset.setTo(200, 500);

    testButtonText.fixedToCamera = true;
    testButtonText.cameraOffset.setTo(10, 50);

    graphics = game.add.graphics(game.world.centerX, game.world.centerY);

    //*** top-ui ***
    // gameRoundGroup
    // graphics.lineStyle(5, 0x0000FF, 1);
    // graphics.drawRect(-360, -290, 140, 50);
    gameRoundGroup = game.add.group();
    gameRoundGroup.position.x = game.world.centerX-340;
    gameRoundGroup.position.y = game.world.centerY-280;

    gameRoundTitleText = "Round #: 6";
    style = { font: "20px Arial", fill: "#000", align: "left" };
    gameRoundTitleText = game.add.text(0, 0, gameRoundTitleText, style);
    gameRoundGroup.add(gameRoundTitleText);
    // end gameRoundGroup

    // gameNameGroup
    // graphics.lineStyle(5, 0x0000FF, 1);
    // graphics.drawRect(-220, -290, 160, 50);
    gameNameGroup = game.add.group();
    gameNameGroup.position.x = game.world.centerX-180;
    gameNameGroup.position.y = game.world.centerY-280;

    gameRoundTitleText = "Cool Kids";
    style = { font: "20px Arial", fill: "#000", align: "left" };
    gameRoundTitleText = game.add.text(0, 0, gameRoundTitleText, style);
    gameNameGroup.add(gameRoundTitleText);
    // end gameNameGroup
    
    // gameTimeGroup
    // graphics.lineStyle(5, 0x0000FF, 1);
    // graphics.drawRect(-60, -290, 160, 50);
    gameTimeGroup = game.add.group();
    gameTimeGroup.position.x = game.world.centerX;
    gameTimeGroup.position.y = game.world.centerY-280;

    gameTimeValueText = "0:59";
    style = { font: "20px Arial", fill: "#000", align: "left" };
    gameTimeValueText = game.add.text(0, 0, gameTimeValueText, style);
    gameTimeGroup.add(gameTimeValueText);
    // end gameTimeGroup

    // gameModeGroup
    // graphics.lineStyle(5, 0x0000FF, 1);
    // graphics.drawRect(100, -290, 210, 50);
    gameModeGroup = game.add.group();
    gameModeGroup.position.x = game.world.centerX+180;
    gameModeGroup.position.y = game.world.centerY-280;

    gameModeValueText = "Classic";
    style = { font: "20px Arial", fill: "#000", align: "left" };
    gameModeValueText = game.add.text(0, 0, gameModeValueText, style);
    gameModeGroup.add(gameModeValueText);
    // end gameModeGroup

    // playerProfileGroup
    // graphics.lineStyle(5, 0x0000FF, 1);
    // graphics.drawRect(310, -290, 50, 50);

    playerProfileGroup = game.add.group();
    playerProfileGroup.position.x = game.world.centerX+320;
    playerProfileGroup.position.y = game.world.centerY-280;
    playerProfileButton = game.make.button(0, 0, 'square_buttons', function(){}, this, 2, 1, 0);
    playerProfileButton.scale.setTo(0.70, 0.70);
    window.rich = playerProfileButton;

    playerProfileGroup.add(playerProfileButton);
    // end playerProfileGroup

    //*** bottom-ui ***
    // diceSpriteGroup
    graphics.lineStyle(5, 0x0000FF, 1);
    graphics.drawRect(-360, 190, 300, 100);

    // shows the die group
    dieGroup = game.add.group();
    dieSpriteGroup = new SpriteGroup("dice", dieGroup, diePool, 6, 120, 1450);
    // dieSpriteGroup.renderSprites("box");
    dieGroup.scale.setTo(0.35,0.35);
    // end diceSpriteGroup

    // gameControlsGroup
    graphics.lineStyle(5, 0x0000FF, 1);
    graphics.drawRect(-60, 190, 160, 100);

    gameControlsGroup = game.add.group();
    gameControlsGroup.position.x = game.world.centerX;
    gameControlsGroup.position.y = game.world.centerY+200;
    decrementDiceAmountButton = game.make.button(-50, 50, 'square_buttons', function(){}, this, 2, 1, 0);
    decrementDiceAmountButton.scale.setTo(0.50, 0.50);
    window.rich = decrementDiceAmountButton;

    incrementDiceAmountButton = game.make.button(-20, 50, 'square_buttons', function(){}, this, 2, 1, 0);
    incrementDiceAmountButton.scale.setTo(0.50, 0.50);
    window.rich = incrementDiceAmountButton;

    decrementDiceValueButton = game.make.button(40, 50, 'square_buttons', function(){}, this, 2, 1, 0);
    decrementDiceValueButton.scale.setTo(0.50, 0.50);
    window.rich = decrementDiceValueButton;

    incrementDiceValueButton = game.make.button(70, 50, 'square_buttons', function(){}, this, 2, 1, 0);
    incrementDiceValueButton.scale.setTo(0.50, 0.50);
    window.rich = incrementDiceValueButton;

    diceAmountText = "3";
    style = { font: "50px Arial", fill: "#000", align: "left" };
    diceAmountTextElement = game.add.text(-35, -10, diceAmountText, style);

    diceValueText = "5";
    style = { font: "50px Arial", fill: "#000", align: "left" };
    diceValueTextElement = game.add.text(55, -10, diceValueText, style);

    gameControlsGroup.add(diceAmountTextElement);
    gameControlsGroup.add(diceValueTextElement);
    gameControlsGroup.add(decrementDiceAmountButton);
    gameControlsGroup.add(incrementDiceAmountButton);
    gameControlsGroup.add(decrementDiceValueButton);
    gameControlsGroup.add(incrementDiceValueButton);
    // end gameControlsGroup

    // gameMenuGroup
    graphics.lineStyle(5, 0x0000FF, 1);
    graphics.drawRect(100, 190, 260, 100);
    window.graphics = graphics;

    gameMenuGroup = game.add.group();
    gameMenuGroup.position.x = game.world.centerX+115;
    gameMenuGroup.position.y = game.world.centerY+200;

    menuButton1 = game.make.button(0, 25, 'rect_buttons', testMethod1, this, 2, 1, 0);
    menuButton1.scale.setTo(0.60, 0.50);
    window.rich = menuButton1;

    menuButton2 = game.make.button(0, 50, 'rect_buttons', testMethod2, this, 2, 1, 0);
    menuButton2.scale.setTo(0.60, 0.50);
    window.rich = menuButton2;

    menuButton3 = game.make.button(120, 25, 'rect_buttons', testMethod3, this, 2, 1, 0);
    menuButton3.scale.setTo(0.60, 0.50);
    window.rich = menuButton3;

    menuButton4 = game.make.button(120, 50, 'rect_buttons', testMethod4, this, 2, 1, 0);
    menuButton4.scale.setTo(0.60, 0.50);
    window.rich = menuButton4;

    gameMenuGroup.add(menuButton1);
    gameMenuGroup.add(menuButton2);
    gameMenuGroup.add(menuButton3);
    gameMenuGroup.add(menuButton4);
    // end gameMenuGroup

    // *** end-bottom-ui ***

    // Begin scene UI group
    // sceneButtonGroup = game.add.group();
    // var button5 = game.make.button(game.world.centerX - 360, 550, 'rect_buttons', waitGame, this, 2, 1, 0);
    // button5.scale.setTo(0.35, 0.35);
    // window.rich = button5;

    // var button6 = game.make.button(game.world.centerX - 280, 550, 'rect_buttons', startGame, this, 2, 1, 0);
    // button6.scale.setTo(0.35, 0.35);
    // window.rich = button6;

    // var button7 = game.make.button(game.world.centerX - 200, 550, 'rect_buttons', continueGame, this, 2, 1, 0);
    // button7.scale.setTo(0.35, 0.35);
    // window.rich = button7;

    // var button8 = game.make.button(game.world.centerX - 120, 550, 'rect_buttons', endGame, this, 2, 1, 0);
    // button8.scale.setTo(0.35, 0.35);
    // window.rich = button8;

    // sceneButtonGroup.add(button5);
    // sceneButtonGroup.add(button6);
    // sceneButtonGroup.add(button7);
    // sceneButtonGroup.add(button8);
    // End scene UI testButtonGroup

    // loop until engine(game).numPlayers = 4
        // waitGame();
    // startGame();
    // loop until engine(game).hasWinner == true
        // continueGame();
    // endGame();
}

function testMethod1() {
    // diePool.resetDiePool();
    var testAjax = {
        game: {
            name: gameName,
            turn: "1",
            diepool: [],
            completed: 1
        }
    };
    //If used a lot, make into a function
    for(var die in diePool.allObjects) {
        testAjax.game.diepool.push(diePool.allObjects[die].id);
    }
    testAjax.game.diepool = JSON.stringify(testAjax.game.diepool);
    $.ajax({
        url: '/games/',
        type: 'POST',
        dataType: 'json',
        data: testAjax,
        success: function(response) {
            console.log("POST");
            console.log(response);
        }
    });
    dieSpriteGroup.renderSprites("box");
    testButtonText.text = "renderSprites";
    // console.log(diePool.allObjects.length);
}

function testMethod2() {
    diePool.shuffleDice();
    testButtonText.text = "shuffleDice";
}

function testMethod3() {
    // loseDice();
    readyButton();
}

function testMethod4() {
    notReady();
    // diePool.resetDiePool();
    testButtonText.text = "Ajax Get Dice from Database";
    // //Append element id to url "/games/"
    // $.ajax({
    //     url: "/games/"+gameId,
    //     type: "GET",
    //     dataType: "json",
    //     success: function (data) {
    //         console.log("GET");
    //         console.log(data);
    //         var dataString = JSON.parse(data.diepool);
    //         //Create temp diepool object
    //         //Make die object with die.id = each element in dataString
    //         //Overwrite old diepool to temp diepool
    //     }
    // });
}

function waitGame(){
    // if client connection is recieved
    players.push(new Player("2:00", playerNames[numPlayers], numPlayers));
    players[numPlayers].getDice(diePool.allObjects);
    playerText.text += players[numPlayers].playerNameText;
    numPlayers++;
    logo.alpha = 1;
    state = "Wait";
    debugText.text = "[State]: " + state + "; [numPlayers]: " + numPlayers + "; [assetsLoaded]: " + assetsLoaded + "; [hasWinner]: " + hasWinner;
    // numPlayersTimeout = setTimeout("waitGame()", 3000);
}

function startGame() {
    // probably do some threading here to load assets faster?
    // clearTimeout(numPlayersTimeout);
    // once done, update engine(game).assetsLoaded == true
    // mine a directory and load every single asset from that directory
    logo.alpha = 0;
    state = "Start";
    debugText.text = "[State]: " + state + "; [numPlayers]: " + numPlayers + "; [assetsLoaded]: " + assetsLoaded + "; [hasWinner]: " + hasWinner;
    assetsLoadedTimeout = setTimeout("startGame()", 5000);
    assetsLoaded = true;
}

function continueGame() {
    // clearTimeout(assetsLoadedTimeout);
    state = "Continue";
    debugText.text = "[State]: " + state + "; [numPlayers]: " + numPlayers + "; [assetsLoaded]: " + assetsLoaded + "; [hasWinner]: " + hasWinner;
    diePoolText.text = "Die pool\n";
    for (var die in diePool.allObjects) {
        diePoolText.text += " " + diePool.allObjects[die].value.toString();
    }
    // update diePool depending on engine(game) rules...
    // use diePool API
    // hasWinnerTimeout = setTimeout("continueGame()", 3000);
}

function endGame() {
    // reset flags
    clearTimeout(hasWinnerTimeout);
    numPlayers = 0;
    assetsLoaded = false;
    hasWinner = false;
    state = "End";
    diePoolText.text = "";
    players = [];
    playerText.text = "";
    debugText.text = "[State]: " + state + "; [numPlayers]: " + numPlayers + "; [assetsLoaded]: " + assetsLoaded + "; [hasWinner]: " + hasWinner;

    emitter = game.add.emitter(game.world.centerX, 250, 200);
    emitter.makeParticles('dollars');
    emitter.setRotation(0, 0);
    emitter.setAlpha(0.3, 0.8);
    emitter.setScale(0.5, 1);
    emitter.gravity = 0;
    emitter.start(false, 4000, 20);

    setTimeout(function(){
        emitter.destroy();
        waitGame();
    }, 3000);
}

// isRoomFull, isLoaded, and isContinue will be used for future implementation of the game loop
function isRoomFull() {
    if (numPlayers === 4) {
        return true;
    } else {
        return false;
    }
}

function isLoaded() {
    if (assetsLoaded) {
        return true;
    } else {
        return false;
    }
}

function isContinue() {
    if (hasWinner) {
        return true;
    } else {
        return false;
    }
}
var game = new Phaser.Game(740, 600, Phaser.AUTO, 'phaser-window', { preload: preload, create: create });
var numPlayers = 0;
var players = [];
var assetsLoaded = false;
var hasWinner = false;
var logo;
var text;
var state;
var diePool;
var playerNames = {
    0: "David",
    1: "Nicu",
    2: "Eric",
    3: "Josh"
};

var maxPlayers = 4;

// temporary button groups
var testButtonGroup;
var sceneButtonGroup;

// timeouts for scenes
var numPlayersTimeout;
var assetsLoadedTimeout;
var hasWinnerTimeout;


// function Game(){
//     this.numPlayers = numPlayers;
// }

function preload() {
    // opal stuff
    // ruby code to scan files
    // for each file, load sprite
    // var all_Files = getAllFilesFromFolder("assets/sprites/");
    // all_Files.forEach(logArrayElements);
    game.load.image('dollars', 'assets/sprites/dollar_sign.png');
    game.load.image('logo', 'assets/sprites/liars_dice_logo.png');
    game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);

    diePool = new diePool(4);
    diePool.generatePool();
}

function create() {
    game.stage.backgroundColor = "#fff";

    logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');

    logo.anchor.setTo(0.5, 0.5);
    logo.alpha = 0;

    game.add.tween(logo).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
    debugText = game.add.text(game.world.centerX, game.world.centerY, "",{ font: "12px Arial", fill: "#ff0044", align: "left" });
    diePoolText = game.add.text(game.world.centerX, game.world.centerY, "",{ font: "12px Arial", fill: "#ff0044", align: "center", wordWrap: true, wordWrapWidth: 100 });
    playerText = game.add.text(game.world.centerX, game.world.centerY, "",{ font: "12px Arial", fill: "#ff0044", align: "center", wordWrap: true, wordWrapWidth: 100 });

    debugText.fixedToCamera = true;
    debugText.cameraOffset.setTo(200, 500);

    // Begin test UI group
    testButtonGroup = game.add.group();
    var button1 = game.make.button(game.world.centerX - 360, 10, 'button', testMethod1, this, 2, 1, 0);
    button1.scale.setTo(0.35, 0.35);
    window.rich = button1;

    var button2 = game.make.button(game.world.centerX - 280, 10, 'button', testMethod2, this, 2, 1, 0);
    button2.scale.setTo(0.35, 0.35);
    window.rich = button2;

    var button3 = game.make.button(game.world.centerX - 200, 10, 'button', testMethod3, this, 2, 1, 0);
    button3.scale.setTo(0.35, 0.35);
    window.rich = button3;

    var button4 = game.make.button(game.world.centerX - 120, 10, 'button', testMethod4, this, 2, 1, 0);
    button4.scale.setTo(0.35, 0.35);
    window.rich = button4;

    testButtonGroup.add(button1);
    testButtonGroup.add(button2);
    testButtonGroup.add(button3);
    testButtonGroup.add(button4);
    // End test UI testButtonGroup

    // Begin scene UI group
    sceneButtonGroup = game.add.group();
    var button5 = game.make.button(game.world.centerX - 360, 550, 'button', waitGame, this, 2, 1, 0);
    button5.scale.setTo(0.35, 0.35);
    window.rich = button5;

    var button6 = game.make.button(game.world.centerX - 280, 550, 'button', startGame, this, 2, 1, 0);
    button6.scale.setTo(0.35, 0.35);
    window.rich = button6;

    var button7 = game.make.button(game.world.centerX - 200, 550, 'button', continueGame, this, 2, 1, 0);
    button7.scale.setTo(0.35, 0.35);
    window.rich = button7;

    var button8 = game.make.button(game.world.centerX - 120, 550, 'button', endGame, this, 2, 1, 0);
    button8.scale.setTo(0.35, 0.35);
    window.rich = button8;

    sceneButtonGroup.add(button5);
    sceneButtonGroup.add(button6);
    sceneButtonGroup.add(button7);
    sceneButtonGroup.add(button8);
    // End scene UI testButtonGroup

    // loop until engine(game).numPlayers = 4
        // waitGame();
    // startGame();
    // loop until engine(game).hasWinner == true
        // continueGame();
    // endGame();
}

function testMethod1() {
    diePool.resetDiePool();
}

function testMethod2() {
    alert("testMethod2");
    //Challenge button
    players[0].challengePlayer(players[1].playerNameText);
}

function testMethod3() {
    alert("testMethod3");
    //displayHandbutton
    players[0].displayHand();
}

function testMethod4() {
    alert("testMethod4");
    players[0].loseDice();
    players[0].displayHand();
}

function waitGame(){
    // if client connection is recieved
    players.push(new Player("2:00", playerNames[numPlayers], numPlayers));
    players[numPlayers].getDice(diePool.allDice);
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
    for (var die in diePool.allDice) {
        diePoolText.text += " " + diePool.allDice[die].value.toString();
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
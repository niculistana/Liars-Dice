var game = new Phaser.Game(740, 600, Phaser.AUTO, 'phaser-window', { preload: preload, create: create });
var numPlayers = 0;
var players = [];
var assetsLoaded = false;
var haveWinner = false;
var logo;
var text;
var state;
var diePool;
var names = {
    0: "David",
    1: "Nicu",
    2: "Eric",
    3: "Josh"
}

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

var group;

function create() {
    game.stage.backgroundColor = "#fff";

    logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');

    logo.anchor.setTo(0.5, 0.5);
    logo.alpha = 0;

    game.add.tween(logo).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
    debugText = game.add.text(game.world.centerX, game.world.centerY, "",{ font: "12px Arial", fill: "#ff0044", align: "center" });
    diePoolText = game.add.text(game.world.centerX, game.world.centerY, "",{ font: "12px Arial", fill: "#ff0044", align: "center", wordWrap: true, wordWrapWidth: 100 });

    debugText.fixedToCamera = true;
    debugText.cameraOffset.setTo(200, 500);

    // Begin test UI group
    group = game.add.group();
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

    // game.input.onDown.addOnce(removeGroup, this);

    group.add(button1);
    group.add(button2);
    group.add(button3);
    group.add(button4);
    // End test UI group

    waitGame();
}

function testMethod1() {
    // alert("testMethod1");
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
    players.push(new Player("2:00", names[numPlayers], numPlayers));
    players[numPlayers].getDice(diePool.allDice);
    numPlayers++;
    logo.alpha = 1;
    state = "Wait;";
    debugText.text = state;
    if(!isRoomFull()) {
        setTimeout("waitGame()", 3000);
    } else {
        numPlayers = 0;
        startGame();
    }
}

function startGame() {
    console.log(players);
    if(!isLoaded()) {
        logo.alpha = 0;
        state = "Start;";
        setTimeout("startGame()", 5000);
        assetsLoaded = true;
    } else {
        assetsLoaded = false;
        continueGame();
    }
}

function continueGame() {
    if(!isContinue()) {
        state = "Continue;";
        debugText.text = state;
        diePoolText.text = "Die pool\n";
        for (var die in diePool.allDice) {
            diePoolText.text += " " + diePool.allDice[die].value.toString();
        }
        setTimeout("continueGame()", 2000);
        haveWinner = true;
    } else {
        state = "End;";
        diePoolText.text = "";
        debugText.text = state;
        haveWinner = false;

        emitter = game.add.emitter(game.world.centerX, 250, 200);
        emitter.makeParticles('dollars');

        emitter.setRotation(0, 0);
        emitter.setAlpha(0.3, 0.8);
        emitter.setScale(0.5, 1);
        emitter.gravity = 0;

        emitter.start(false, 4000, 20);
        setTimeout(function(){
            players = [];
            emitter.destroy();
            waitGame();
        }, 3000);
    }
}

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
    if (haveWinner) {
        return true;
    } else {
        return false;
    }
}
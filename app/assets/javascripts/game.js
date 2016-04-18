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
    game.load.image('dice1', 'assets/sprites/boardgamepack/PNG/Dice/dieRed1.png');
    game.load.image('dice2', 'assets/sprites/boardgamepack/PNG/Dice/dieRed2.png');
    game.load.image('dice3', 'assets/sprites/boardgamepack/PNG/Dice/dieRed3.png');
    game.load.image('dice4', 'assets/sprites/boardgamepack/PNG/Dice/dieRed4.png');
    game.load.image('dice5', 'assets/sprites/boardgamepack/PNG/Dice/dieRed5.png');
    game.load.image('dice6', 'assets/sprites/boardgamepack/PNG/Dice/dieRed6.png');
    diePool = new diePool(4);
    diePool.generatePool();
}

function create() {
    //Do a if statement to check if game is not created
    $("#myModal").modal();
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

    // shows the die group
    dieGroup = game.add.group();
    dieSpriteGroup = new SpriteGroup("dice", dieGroup, diePool, 6, 900, 700);
    // dieSpriteGroup.renderSprites("box");
    dieGroup.scale.setTo(0.35,0.35);

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
    // sceneButtonGroup = game.add.group();
    // var button5 = game.make.button(game.world.centerX - 360, 550, 'button', waitGame, this, 2, 1, 0);
    // button5.scale.setTo(0.35, 0.35);
    // window.rich = button5;

    // var button6 = game.make.button(game.world.centerX - 280, 550, 'button', startGame, this, 2, 1, 0);
    // button6.scale.setTo(0.35, 0.35);
    // window.rich = button6;

    // var button7 = game.make.button(game.world.centerX - 200, 550, 'button', continueGame, this, 2, 1, 0);
    // button7.scale.setTo(0.35, 0.35);
    // window.rich = button7;

    // var button8 = game.make.button(game.world.centerX - 120, 550, 'button', endGame, this, 2, 1, 0);
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
            name: "Fucking hell",
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
        url: '/games',
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
    diePool.removeDie(0);
    var testAjax = {
        _method: 'PUT',
        game: {
            name: "Fucking hell",
            turn: "1",
            diepool: [],
            completed: 1
        }
    };
    for(var die in diePool.allObjects) {
        testAjax.game.diepool.push(diePool.allObjects[die].id);
    }
    testAjax.game.diepool = JSON.stringify(testAjax.game.diepool);
    $.ajax({
        url: '/games/4',
        type: 'POST',
        data: testAjax,
        success: function(response) {
            console.log("I have put");

        }
    });
    dieGroup.removeAll();
    dieSpriteGroup.renderSprites("box");
    testButtonText.text = "RemoveAll()";
}

function testMethod4() {
    // diePool.resetDiePool();
    testButtonText.text = "Ajax Get Dice from Database";
    //Append element id to url "/games/"
    $.ajax({
        url: "/games/4",
        type: "GET",
        dataType: "json",
        success: function (data) {
            console.log("GET");
            console.log(data);
            var dataString = JSON.parse(data.diepool);
            //Create temp diepool object
            //Make die object with die.id = each element in dataString
            //Overwrite old diepool to temp diepool
        }
    })
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

Pusher.log = function(message) {
    if (window.console && window.console.log) {
        window.console.log(message);
    }
};

var pusher = new Pusher("926b2fce0ff5222dc001", {
    cluster: 'eu',
    encrypted: true
});

var channel = pusher.subscribe('game_channel');
channel.bind('my_event', function(data) {
    console.log("I have made my move");
});
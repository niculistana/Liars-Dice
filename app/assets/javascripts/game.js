var game = new Phaser.Game(740, 600, Phaser.AUTO, 'phaser-window', { preload: preload, create: create });
var numPlayers = 0;
var assetsLoaded = false;
var haveWinner = false;
var logo;
var text;

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
}

function create() {
    game.stage.backgroundColor = "#fff";

    logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');

    logo.anchor.setTo(0.5, 0.5);
    logo.alpha = 0;

    game.add.tween(logo).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
    state = game.add.text(game.world.centerX, game.world.centerY, "",{ font: "12px Arial", fill: "#ff0044", align: "center" });

    waitGame();
}

function waitGame(){
    numPlayers++;
    logo.alpha = 1;
    state.text = "";
    console.log(numPlayers);
    if(!isRoomFull()) {
        setTimeout("waitGame()", 3000);
    } else {
        numPlayers = 0;
        startGame();
    }
}

function startGame() {
    if(!isLoaded()) {
        logo.alpha = 0;
        state.text = "Start;";
        // alert("Game has started!");
        setTimeout("startGame()", 5000);
        assetsLoaded = true;
    } else {
        assetsLoaded = false;
        continueGame();
    }
}

function continueGame() {
    if(!isContinue()) {
        state.text = "Continue;";
        // alert("Game is going on...");
        setTimeout("continueGame()", 2000);
        haveWinner = true;
    } else {
        // alert("Game has ended...");
        state.text = "End;";
        haveWinner = false;

        emitter = game.add.emitter(game.world.centerX, 250, 200);
        emitter.makeParticles('dollars');

        emitter.setRotation(0, 0);
        emitter.setAlpha(0.3, 0.8);
        emitter.setScale(0.5, 1);
        emitter.gravity = 0;

         // false means don't explode all the sprites at once, but instead release at a rate of 20 particles per frame
         // The 5000 value is the lifespan of each particle
        emitter.start(false, 4000, 20);
        setTimeout(function(){
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
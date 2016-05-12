var game = new Phaser.Game(740, 600, Phaser.AUTO, 'phaser-window', { preload: preload, create: create });
var assetsLoaded = false;
var logo;
var text;
var state;
var globalDiePool;
var dieBidPool;
var playerPool;
var channel;
var channel2;
var gameId = "";
var gameName = "";
var numPlayers = 4;

var gameFileKeys = ['dollars', 'logo', 'dice1', 'dice2', 'dice3', 'dice4', 'dice5', 'dice6',
'player1','player2','player3','player4','player5','player6','player7','player8'];
var gameFiles = ['sprites/dollar_sign.png', 'sprites/liars_dice_logo.png',
'sprites/_main/dice/dieRed1.png', 'sprites/_main/dice/dieRed2.png',
'sprites/_main/dice/dieRed3.png', 'sprites/_main/dice/dieRed4.png',
'sprites/_main/dice/dieRed5.png', 'sprites/_main/dice/dieRed6.png',
'sprites/_main/player/player1.png', 'sprites/_main/player/player2.png',
'sprites/_main/player/player3.png', 'sprites/_main/player/player4.png',
'sprites/_main/player/player5.png', 'sprites/_main/player/player6.png',
'sprites/_main/player/player7.png', 'sprites/_main/player/player8.png'];
var pusher = new Pusher("926b2fce0ff5222dc001", {
    cluster: 'eu',
    encrypted: true
});

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

function preload() {
    //For production, we change the url to intense-temple
    game.load.baseURL = "http://localhost:3000/";
    // game.load.baseURL = "https://intense-temple-36417.herokuapp.com";
    game.load.path = "assets/";
    game.load.spritesheet('rect_buttons', 'sprites/uipack_fixed/new_ui/buttons/rect_buttons.png', 192, 49);
    game.load.spritesheet('square_buttons', 'sprites/uipack_fixed/new_ui/buttons/square_buttons.png', 51, 49);
    game.load.images(gameFileKeys, gameFiles);
    globalDiePool = new diePool();
    globalDiePool.generatePool(numPlayers);
    dieBidPool = new diePool();
    playerPool = new playerPool(numPlayers);
    // playerPool.generatePool();
}

$(document).ready(function(event){
    $.get('/session/name_id', onGetNameIdSuccess);
});

function onGetNameIdSuccess(event) {
    gameId = event.id.toString();
    gameName = event.name;
    console.log("game_channel"+gameId);
    channel = pusher.subscribe("game_channel"+gameId);
    channel2 = pusher.subscribe("chat_channel"+gameId);
    channel2.bind('chat', chat);
    channel.bind('challenge_event', function(data) {
        //Convert diepool from the controller into diepool object
        var diePoolController = data.globalDiepool.split(",").map(Number);
        var newObject = [];
        for(var i = 0; i < diePoolController.length; i++) {
            newObject.push(new Die(diePoolController[i]));
        }
        //Set globalDiePool.allObjects = newObject
        globalDiePool.allObjects = newObject;

        //render diepool
        console.log(globalDiePool.allObjects);

        //Maybe remove a die
        //Deal back die, with the loser getting the less die
        if(data.result) {
            //Challenger loses dice
            console.log("Current player lost");
        } else {
            //Challengee loses dice
            console.log("previous player lost");
        }
        //deal back dice
    });
    channel.bind("bid_event", function(event) {
        //render bid to everyone
        $('#dieQuantity').text(event.quantity);
        $('#dieValue').text(event.value);

        dieBidPool.resetDiePool();
        dieBidGroup.removeAll();
        dieValue = parseInt($("#dieValue").text());
        dieQuantity = parseInt($("#dieQuantity").text());
        for (var i = 0; i < dieQuantity; i++) 
            dieBidPool.addDie(new Die(Math.ceil(dieValue)));
        dieBidSpriteGroup.renderSprites("box");

        dieQuantity = event.quantity;
        dieValue = event.value;
        var playerUsername = event.name;
        testButtonText.text = playerUsername + " placed a bid: " + 
        dieQuantity + " #" + dieValue + "'s";
    });
    channel.bind("render_add", function(event) {
        console.log("I have rendered");
        console.log(event);
        $.get('/session/recent_user/', function(event) {
            //Make button unclickable so that user does
            //not join multiple times
            var playerId = event.user_id;
            var playerUsername = event.uname;
            var dice = event.dice;
            testButtonText.text = playerUsername + " joined the game.";
            playerPool.addPlayer(new Player(playerUsername, playerId));
            console.log(playerPool.allObjects);
            // playerPool.removePlayer(playerPool.getUserIndexByUserName(playerUsername));
            playerSpriteGroup.renderSprites("octagonal");
        });
    });
    channel.bind("render_delete", function(event) {
        console.log("I have rendered");
        console.log(event);
        var playerId = event.user_id;
        $.get('/session/recent_user_name/'+playerId, function(event) {
            var playerUsername = event.uname;
            testButtonText.text = playerUsername + " left the game.";
            playerGroup.removeAll();
            playerPool.removePlayer(playerPool.getUserIndexByUserName(playerUsername));
            playerSpriteGroup.renderSprites("octagonal");
        });
    });

    channel.bind("render_game_start", function(event) {
        var gameName = event.name;
        testButtonText.text = gameName + " has started, enjoy!";
    });

    channel.bind("render_round_start", function(event) {
        // do event broadcasting stuff here
        // disable others from performing actions by disabling ui
        // broadcast least recently updated player to be their turn
        testButtonText.text = "It's Listana's turn to bid.";
        var turnTime = 3, seconds;
        setInterval(function () {
            seconds = parseInt(turnTime % 60, 10);
            seconds = seconds < 10 ? "0" + seconds : seconds;

            $(".turnSeconds").text(seconds);

            if (--turnTime < 0) {
                turnTime = 0;
                testButtonText.text = "Time is up! " +  playerUsername + " lost a die.";
            }
        }, 1000);
    });

    channel.bind("render_round_end", function(event) {
        // do event broadcasting stuff here
        // increment round number here
        testButtonText.text = "Round # 2 ended. Starting round # 3.";
    });

    channel.bind("render_turn_start", function(event) {
        // do event broadcasting stuff here
        // disable others from performing actions by disabling ui
        // broadcast least recently updated player to be their turn
        $.get('/session/least_recent_user/', function(event) {
            var playerId = event.user_id;
            var playerUsername = event.uname;
            var dice = event.dice;
            testButtonText.text = "It's " + playerUsername + "'s' turn to bid or challenge.";

            var turnTime = 3, seconds;
            setInterval(function () {
                seconds = parseInt(turnTime % 60, 10);
                seconds = seconds < 10 ? "0" + seconds : seconds;

                $(".turnSeconds").text(seconds);

                if (--turnTime < 0) {
                    turnTime = 0;
                    testButtonText.text = "Time is up! " +  playerUsername + " lost a die.";
                    endTurn();
                }
            }, 1000);
        });
    });

    channel.bind("render_turn_end", function(event) {
        // do event broadcasting stuff here
        // render next player in queue
        testButtonText.text = "Next turn: MastaChau.";
    });

    channel.bind("render_game_end", function(event) {
        // do event broadcasting stuff here
        // render next player in queue
        testButtonText.text = "Game ayyLmao is over! The winner is: Listana! Congratulations :)";
    });
}

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
    // *** end top-ui ***

    // ** player area **
    // shows the player group
    playerGroup = game.add.group();
    playerSpriteGroup = new SpriteGroup("player", playerGroup, playerPool, 6, -20, -80);
    playerGroup.position.setTo(game.world.centerX, game.world.centerY);
    playerGroup.scale.setTo(0.75,0.75);
    // end playerSpriteGroup
    // ** end player area **

    //*** bottom-ui ***
    // diceSpriteGroup
    graphics.lineStyle(5, 0x0000FF, 1);
    graphics.drawRect(-360, 190, 300, 100);

    // shows the die group
    dieGroup = game.add.group();
    dieSpriteGroup = new SpriteGroup("dice", dieGroup, globalDiePool, 120, 1450);
    // dieSpriteGroup.renderSprites("box");
    dieGroup.scale.setTo(0.35,0.35);
    // end diceSpriteGroup

    // dieBidSpriteGroup
    // shows the dieBid group
    dieBidGroup = game.add.group();
    dieBidSpriteGroup = new SpriteGroup("dice", dieBidGroup, dieBidPool, game.world.centerX+500, game.world.centerY);
    // dieBidSpriteGroup.renderSprites("box");
    dieBidGroup.scale.setTo(0.35,0.35);
    // end diceBidSpriteGroup

    // gameControlsGroup
    graphics.lineStyle(5, 0x0000FF, 1);
    graphics.drawRect(-60, 190, 160, 100);

    gameControlsGroup = game.add.group();
    gameControlsGroup.position.x = game.world.centerX;
    gameControlsGroup.position.y = game.world.centerY+200;
    decrementDieQuantityButton = game.make.button(-50, 30, 'square_buttons', decrementDieQuantity, this, 2, 1, 0);
    decrementDieQuantityButton.scale.setTo(0.35, 0.35);
    window.rich = decrementDieQuantityButton;

    incrementDieQuantityButton = game.make.button(-20, 30, 'square_buttons', incrementDieQuantity, this, 2, 1, 0);
    incrementDieQuantityButton.scale.setTo(0.35, 0.35);
    window.rich = incrementDieQuantityButton;

    decrementDieValueButton = game.make.button(40, 30, 'square_buttons', decrementDieValue, this, 2, 1, 0);
    decrementDieValueButton.scale.setTo(0.35, 0.35);
    window.rich = decrementDieValueButton;

    incrementDieValueButton = game.make.button(70, 30, 'square_buttons', incrementDieValue, this, 2, 1, 0);
    incrementDieValueButton.scale.setTo(0.35, 0.35);
    window.rich = incrementDieValueButton;
 
    challengeButton = game.make.button(-50, 60, 'rect_buttons', challenge, this, 2, 1, 0);
    challengeButton.scale.setTo(0.25, 0.50);
    window.rich = challengeButton;

    makeBidButton = game.make.button(40, 60, 'rect_buttons', bid, this, 2, 1, 0);
    makeBidButton.scale.setTo(0.25, 0.50);
    window.rich = makeBidButton;

    gameControlsGroup.add(decrementDieQuantityButton);
    gameControlsGroup.add(incrementDieQuantityButton);
    gameControlsGroup.add(decrementDieValueButton);
    gameControlsGroup.add(incrementDieValueButton);
    gameControlsGroup.add(challengeButton);
    gameControlsGroup.add(makeBidButton);
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

// function challengeBid() {
//     $.get('/session/user_id/', function(event){
//         var playerId = event.uid;
//         $.get('/session/recent_user_name/'+playerId, function(event) {
//             var playerUsername = event.uname;
//             testButtonText.text = playerUsername + " challenges the bid!";
//         });
//     });
//}
/*** End bidding methods ***/

function testMethod1() {
    // globalDiePool.resetDiePool();
    // globalDiePool.generatePool(numPlayers);
    // var testAjax = {
    //     _method: 'PUT',
    //     game: {
    //         turn: "Nicu",
    //         diepool: [],
    //         completed: 1,
    //     }
    // };
    // //If used a lot, make into a function
    // for(var die in globalDiePool.allObjects) {
    //     testAjax.game.globalDiepool.push(globalDiePool.allObjects[die].id);
    // }
    // testAjax.game.diepool = JSON.stringify(testAjax.game.diepool);
    // testAjax.game.diepool = testAjax.game.globalDiepool.substring(1, testAjax.game.globalDiepool.length-1);
    // $.ajax({
    //     url: '/games/'+gameId,
    //     type: 'POST',
    //     dataType: 'json',
    //     data: testAjax,
    //     success: function(response) {
    //         console.log("POST");
    //         console.log(response);
    //     }
    // });
    // startGame();
    testButtonText.text = "startGame";
}

function testMethod2() {
    // globalDiePool.shuffleDice();
    // challenge();
    // bid();
    // // testButtonText.text = "Challenge";
    // startTurn();
    startRound();
}

function testMethod3() {
    joinLobby();
    // readyButton();
}

function testMethod4() {
    leaveLobby();
    // playerPool.removePlayer(0);
    // playerSpriteGroup.renderSprites("octagonal");
}

/*** deprecated methods***/

// function waitGame(){
//     // if client connection is recieved
//     players.push(new Player("2:00", playerNames[numPlayers], numPlayers));
//     players[numPlayers].getDice(globalDiePool.allObjects);
//     playerText.text += players[numPlayers].playerNameText;
//     numPlayers++;
//     logo.alpha = 1;
//     state = "Wait";
//     debugText.text = "[State]: " + state + "; [numPlayers]: " + numPlayers + "; [assetsLoaded]: " + assetsLoaded + "; [hasWinner]: " + hasWinner;
//     // numPlayersTimeout = setTimeout("waitGame()", 3000);
// }

// function startGame() {
//     // probably do some threading here to load assets faster?
//     // clearTimeout(numPlayersTimeout);
//     // once done, update engine(game).assetsLoaded == true
//     // mine a directory and load every single asset from that directory
//     logo.alpha = 0;
//     state = "Start";
//     debugText.text = "[State]: " + state + "; [numPlayers]: " + numPlayers + "; [assetsLoaded]: " + assetsLoaded + "; [hasWinner]: " + hasWinner;
//     assetsLoadedTimeout = setTimeout("startGame()", 5000);
//     assetsLoaded = true;
// }

// function continueGame() {
//     // clearTimeout(assetsLoadedTimeout);
//     state = "Continue";
//     debugText.text = "[State]: " + state + "; [numPlayers]: " + numPlayers + "; [assetsLoaded]: " + assetsLoaded + "; [hasWinner]: " + hasWinner;
//     diePoolText.text = "Die pool\n";
//     for (var die in globalDiePool.allObjects) {
//         diePoolText.text += " " + globalDiePool.allObjects[die].value.toString();
//     }
//     // update diePool depending on engine(game) rules...
//     // use diePool API
//     // hasWinnerTimeout = setTimeout("continueGame()", 3000);
// }

// function endGame() {
//     // reset flags
//     clearTimeout(hasWinnerTimeout);
//     numPlayers = 0;
//     assetsLoaded = false;
//     hasWinner = false;
//     state = "End";
//     diePoolText.text = "";
//     players = [];
//     playerText.text = "";
//     debugText.text = "[State]: " + state + "; [numPlayers]: " + numPlayers + "; [assetsLoaded]: " + assetsLoaded + "; [hasWinner]: " + hasWinner;

//     emitter = game.add.emitter(game.world.centerX, 250, 200);
//     emitter.makeParticles('dollars');
//     emitter.setRotation(0, 0);
//     emitter.setAlpha(0.3, 0.8);
//     emitter.setScale(0.5, 1);
//     emitter.gravity = 0;
//     emitter.start(false, 4000, 20);

//     setTimeout(function(){
//         emitter.destroy();
//         waitGame();
//     }, 3000);
// }

/*** end deprecated methods***/
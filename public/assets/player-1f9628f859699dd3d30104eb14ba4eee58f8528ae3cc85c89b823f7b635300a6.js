function Player(t,i){this.dice=null,this.id=i,this.name=t,this.score=0,this.bet={quantity:1,value:1},this.currentState="Playing",this.getDice=function(t){this.dice=[];for(var e=diceAssignment[i][0];e<=diceAssignment[i][1];e++)this.dice.push(t[e])},this.bet=function(t,i){this.bet.quantity=t,this.bet.value=i},this.challengePlayer=function(t){console.log("Player "+this.name+" challenged "+t)},this.changePlayerState=function(t){this.currentState=t},this.loseDice=function(){this.dice.splice(0,1)},this.displayHand=function(){for(var t="",i=0;i<this.dice.length;i++)t+=" "+this.dice[i].value;console.log("The player's hand is: "+t)}}
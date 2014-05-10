!function(_,ss2d,window,undefined) {

  window.Game = function() {
    var spritesConfigs = [
      CharacterFactory.get({
        name: "Naranja", keyboard: "1"
      }),
      CharacterFactory.get({
        name: "Azul", keyboard: "2"
      }),
      CharacterFactory.get({
        name: "Morado", keyboard: "3"
      }),
      CharacterFactory.get({
        name: "Verde", keyboard: "4"
      })
    ];
    var maxPlayers = spritesConfigs.length;
    var minPlayers = 2;
    document.getElementById('mainCanvas').focus();
    this.view = new ss2d.View('mainCanvas');
    this.view.mMainScene.addObject(new ss2d.Sprite(0, 0, 800, 600, 'assets/img/bg.png'));
    var playerCount;
    while(isNaN(playerCount))
      playerCount = Math.min(4,Math.max(1,parseInt(prompt("How many players ("+minPlayers+"-"+maxPlayers+")?", "2"),10)));

    this.sprites = [];

    for(var i = 0; i < playerCount; i++) {
      this.sprites.push(spritesConfigs[i])
    }
    this.obstacles = ObstacleFactory.getSet(10);

    this.scoreBoard = new ScoreBoard

    var i,iLen, charac, alive = this.sprites.slice(0);
    for(i = 0, iLen = this.sprites.length; i< iLen ;i++){
      this.scoreBoard.addPlayer(this.sprites[i])
      if(playerCount === 1) {
        this.scoreBoard.addScoreTracker(this.sprites[i]) ;
      }
      this.sprites[i].addListener('died', function(){
        alive = _(alive).reject(_.bind(function(sprite){
          return sprite.name== this.name
        },this))
        if(alive.length == 1 && window.confirm( alive[0].name + ' won! New Game?') ){
          window.location.reload()
        };
      })
    }

    this.addObjects(this.obstacles, this.view.mMainScene, "sprite");
    this.addObjects(this.scoreBoard, this.view.mMainScene, "view");
    this.addObjects(this.sprites, this.view.mMainScene, "container");
  }

  _.extend(Game.prototype, {
    run : function(){
      // run the program
      this.view.startLoop();
    },
    addObjects : function(objects, scene, objectKey) {
      if(!objects.push) objects = [objects]
      for(var i = objects.length; i--;){
        scene.addObject(objects[i][objectKey]);
      }
    }
  });

}(_,ss2d,this)

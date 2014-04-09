!function(_,ss2d,window,undefined) {

  window.Game = function(){
    document.getElementById('mainCanvas').focus();
    this.view = new ss2d.View('mainCanvas');
    this.view.mMainScene.addObject(new ss2d.Sprite(0, 0, 800, 600, 'assets/img/bg.png'));
    this.sprites = [
      CharacterFactory.get({
        name: "Sonic", keyboard: "2"
      }),
      CharacterFactory.get({
        name: "Blanka", keyboard: "1"
      })
    ];
    this.obstacles = ObstacleFactory.getSet(10);

    this.scoreBoard = new ScoreBoard

    var i;
    for(i = this.sprites.length; i--;){
      this.scoreBoard.add(this.sprites[i])
    }
    addObjects(this.obstacles, this.view.mMainScene, "sprite");

    this.view.mMainScene.addObject(this.scoreBoard.view);

    addObjects(this.sprites, this.view.mMainScene, "container");
  }

  _.extend(Game.prototype, {
    run : function(){
      // run the program
      this.view.startLoop();
    }
  });

  function addObjects(objects, scene, objectKey) {
    for(var i = objects.length; i--;){
      scene.addObject(objects[i][objectKey]);
    }
  }
}(_,ss2d,this)

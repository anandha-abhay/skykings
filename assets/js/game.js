!function(_,ss2d,window,undefined) {

  window.Game = function(){
    document.getElementById('mainCanvas').focus();
    this.view = new ss2d.View('mainCanvas');
    this.view.mMainScene.addObject(new ss2d.Sprite(0, 0, 800, 600, 'assets/img/bg.png'));
    this.sprites = [
      CharacterFactory.get({
        name: "Sonic", keyboard: "1"
      }),
      CharacterFactory.get({
        name: "Blanka", keyboard: "2"
      })
    ];
    this.obstacles = [
      new SpriteObstacle({
        obstacle: (new ss2d.Sprite(700, -400, 64, 1200, 'assets/img/pillar.png')),
        scene: this.view.mMainScene,
        speed: 5
      }),
      new SpriteObstacle({
        obstacle: (new ss2d.Sprite(1000, -450, 64, 1200, 'assets/img/pillar.png')),
        scene: this.view.mMainScene,
        speed: 5
      }),
      new SpriteObstacle({
        obstacle: (new ss2d.Sprite(1300, -300, 64, 1200, 'assets/img/pillar.png')),
        scene: this.view.mMainScene,
        speed: 5
      }),
      new SpriteObstacle({
        obstacle: (new ss2d.Sprite(1600, -450, 64, 1200, 'assets/img/pillar.png')),
        scene: this.view.mMainScene,
        speed: 5
      }),
      new SpriteObstacle({
        obstacle: (new ss2d.Sprite(1900, -400, 64, 1200, 'assets/img/pillar.png')),
        scene: this.view.mMainScene,
        speed: 5
      }),
      new SpriteObstacle({
        obstacle: (new ss2d.Sprite(2100, -400, 64, 1200, 'assets/img/pillar.png')),
        scene: this.view.mMainScene,
        speed: 5
      }),
      new SpriteObstacle({
        obstacle: (new ss2d.Sprite(700, -400, 64, 1200, 'assets/img/pillar.png')),
        scene: this.view.mMainScene,
        speed: 5
      }),
      new SpriteObstacle({
        obstacle: (new ss2d.Sprite(700, -400, 64, 1200, 'assets/img/pillar.png')),
        scene: this.view.mMainScene,
        speed: 5
      }),
      new SpriteObstacle({
        obstacle: (new ss2d.Sprite(700, -400, 64, 1200, 'assets/img/pillar.png')),
        scene: this.view.mMainScene,
        speed: 5
      }),
      new SpriteObstacle({
        obstacle: (new ss2d.Sprite(700, -400, 64, 1200, 'assets/img/pillar.png')),
        scene: this.view.mMainScene,
        speed: 5
      }),
      new SpriteObstacle({
        obstacle: (new ss2d.Sprite(700, -400, 64, 1200, 'assets/img/pillar.png')),
        scene: this.view.mMainScene,
        speed: 5
      }),
    ];
    this.scoreBoard = new ScoreBoard

    var i;
    for(i = this.sprites.length; i--;){
      this.scoreBoard.add(this.sprites[i])
    }
    addObjects(this.obstacles, this.view.mMainScene, "obstacle");
    for(i = this.scoreBoard.lifeMeters.length; i--; ) {
      this.view.mMainScene.addObject(this.scoreBoard.lifeMeters[i].HPTextDisplay);
    }

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

!function(_,ss2d,window,undefined) {

  window.Game = function(){
    this.view = new ss2d.View('mainCanvas');
    this.view.mMainScene.addObject(new ss2d.Sprite(0, 0, 800, 600, 'assets/img/bg.png'));
    this.sprites = [
      new SpriteGuy({
        guy: (new ss2d.ReelSprite(30,150,3,'assets/img/hedgehog.reelset','flying')),
        upKey: "S", attackKey: "A", blockKey: "D",
        name: "Sonic"
      }),
      new SpriteGuy({
        guy: (new ss2d.ReelSprite(30,50,1.5,'assets/img/blanka.reelset','flying')),
        upKey: "K", attackKey: "J", blockKey: "L",
        name: "Blanka"
      })
    ]
    this.scoreBoard = new ScoreBoard

    var i;
    for(i = this.sprites.length; i--;){
      this.scoreBoard.add(this.sprites[i])
      this.view.mMainScene.addObject(this.sprites[i].guy);
    }
    for(i = this.scoreBoard.lifeMeters.length; i--; ) {
      this.view.mMainScene.addObject(this.scoreBoard.lifeMeters[i].HPTextDisplay);
    }
  }

  _.extend(Game.prototype, {
    run : function(){
      // run the program
      this.view.startLoop();
    }
  });
}(_,ss2d,this)

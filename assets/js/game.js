!function(_,window,undefined) {

  window.Game = function(){
    this.view = new ss2d.View('mainCanvas');
    this.sprites = [
      new SpriteGuy({
        guy: (new ss2d.ReelSprite(30,50,0.5,'assets/img/cat.reelset','flying')),
        upKey: "S", attackKey: "A", blockKey: "D",
        name: "Cat"
      }),
      new SpriteGuy({
        guy: (new ss2d.ReelSprite(30,50,1.5,'assets/img/blanka.reelset','flying')),
        upKey: "K", attackKey: "J", blockKey: "L",
        name: "Chicken"
      })
    ]
    for(var i = this.sprites.length; i--;){
      this.view.mMainScene.addObject(this.sprites[i].guy);
    }

  }

  _.extend(Game.prototype, {
    run : function(){
      // run the program
      this.view.startLoop();
    }
  });
}(_,this)

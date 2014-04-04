!function(_,window,undefined) {

  window.Game = function(){
    this.view = new ss2d.View('mainCanvas');
    this.sprites = [
      new SpriteGuy({
        guy: (new ss2d.Sprite(30,100,40,40,'assets/img/cat.png')),
        upKey: "S", attackKey: "A", blockKey: "D",
        name: "Cat"
      }),
      new SpriteGuy({
        guy: (new ss2d.Sprite(30,50,40,40,'assets/img/chicken.png')),
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

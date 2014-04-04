!function(_,window,undefined) {

  window.SpriteGuy = function(options){
    this.guy = options.guy;
    this.guy.upKey = options.upKey;
    this.guy.mPivotX = this.guy.mPivotY = 20;
    this.guy.tick = this.tick.bind(this);
  }

  _.extend(SpriteGuy.prototype, {
    flap : function(){
      var currentPos = this.guy.mLocation.mY;
      if(isNaN(currentPos)) return;
      if(!this.lastFlapPos || currentPos > this.lastFlapPos+10) {
        if(currentPos > 30) {
          this.lastFlapPos = currentPos - 30;
          this.flyTo.call(this,this.lastFlapPos)
        }
      }
    },
    flyTo : function(pos) {
      var p = pos;
      this.guy.mRotation = 1
      var flyLooper = (function(){
        var newPos = this.guy.mLocation.mY - 10;
        if (newPos >= p-10) {
          this.guy.mLocation.mY = newPos;
          setTimeout(flyLooper, 15)
        } else {
          this.guy.mRotation = 0
        }
      }).bind(this);
      flyLooper()
    },
    tick: function(deltaTime) {
      var input = ss2d.CURRENT_VIEW.mInput;
      // fall 5px per frame
      if(this.guy.mLocation.mY < 580) {
        this.guy.mLocation.mY += 2;
      }
      if(input.isKeyPressed(this.guy.upKey)) {
        this.flap()
      }
    }
  })
}(_,this)

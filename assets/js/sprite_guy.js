!function(window,undefined) {

  window.SpriteGuy = function(options){
    var _this = this;
    this.guy = options.guy;
    this.guy.upKey = options.upKey;
    this.guy.mPivotX = this.guy.mPivotY = 20;
    this.guy.tick = function() { _this.flap.apply(_this.guy,arguments); }
  }

  SpriteGuy.prototype.flap = function(deltaTime) {
    var input = ss2d.CURRENT_VIEW.mInput;

    // fall 5px per frame
    if(this.mLocation.mY < 580) {
      this.mLocation.mY += 5;
    }
    if(input.isKeyPressed(this.upKey) && this.mLocation.mY > 20) {
      // raise 20px per frame
      this.mLocation.mY -= 20;
    }
  }
}(this)

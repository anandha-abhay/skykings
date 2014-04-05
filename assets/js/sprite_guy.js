!function(_,ss2d,window,undefined) {

  window.SpriteGuy = function(options){
    this.hp = 10;
    this.invincible = 100; //start game as invincible
    this.attacking = false;
    this.blocking = false;
    this.name = options.name;
    this.guy = options.guy;
    this.guy.character = this;
    this.guy.upKey = ss2d.Input.Keys[options.upKey];
    this.guy.attackKey = ss2d.Input.Keys[options.attackKey];
    this.guy.blockKey = ss2d.Input.Keys[options.blockKey];
    //this.guy.mPivotX = this.guy.mPivotY = 20;
    this.guy.tick = this.tick.bind(this);
  }

  _.extend(window.SpriteGuy.prototype, EventEmitter.prototype,  {
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
      //this.guy.mRotation = 1
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
    onPlayer : function(){
      var colliderBounds = this.guy.getBounds();
      for(var childIndex in this.guy.mParent.mChildren) {
        var brother = this.guy.mParent.mChildren[childIndex];
        //check that the other object is not itself
        if(brother != this.guy && brother.character) {
          //if the objects collide change the direction.
          if(colliderBounds.intersectsRectangle(brother.getBounds())) {
            return brother.character;
          }
        }
      }
      return false;
    },
    blinkInvincible : function(){
      this.invincible = 100;
    },
    takeDamage : function(){
      if(!this.invincible) {
        this.hp = Math.max(0,this.hp - 1)
        this.blinkInvincible() // prevent multiple attacks at a time
        this.emit('hpAdjust')
        if(this.hp == 0) {
          this.emit('died')
        }
      }
    },
    tick: function(deltaTime) {
      if(!this.guy.mPlayingReel) return;
      var input = ss2d.CURRENT_VIEW.mInput;

      //update sprite reel state
      this.guy.updateReelAnimation(deltaTime);
      // fall 5px per frame
      if(this.guy.mLocation.mY < 500) {
        this.guy.mLocation.mY += 2;
      }

      this.attacking = false;
      this.blocking = false;
      this.invincible = Math.max(0,this.invincible - 1);

      // only one button can be pressed during a tick
      if(input.isKeyPressed(this.guy.upKey)) {
        this.flap()
      } else if(this.invincible) {
        //noop
      } else if (input.isKeyPressed(this.guy.attackKey)) {
        this.attacking = true;
      } else if(input.isKeyPressed(this.guy.blockKey)) {
        this.blocking = true;
      }

      if(this.attacking) {
        if(this.guy.mPlayingReel.mName != 'attack'){ this.guy.playReel('attack'); }
      }else if(this.invincible){
        if(this.guy.mPlayingReel.mName != 'invincible')
          this.guy.playReel('invincible')
      }else{
        if(this.guy.mPlayingReel.mName != 'flying')
          this.guy.playReel('flying')
      }
      var collidingWith = this.onPlayer()
      if(collidingWith){
        if(this.attacking && !collidingWith.blocking && !collidingWith.invincible) {
          collidingWith.takeDamage();
        }
      }
    }
  })
}(_,ss2d,this)

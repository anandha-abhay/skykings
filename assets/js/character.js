!function(_,ss2d,window,undefined) {

  window.CharacterFactory= (function(){
    var characters = {
      'Blanka' : {
        "scale": 1.5,
        "img"  : "assets/img/blanka.reelset"
      },
      'Sonic' : {
        "scale": 3,
        "img"  : "assets/img/hedgehog.reelset"
      }
    }

    var keyboards = {
      "1" : ["S","A","D"],
      "2" : ["K","J","L"],
      "3" : ["ARROW_UP","ARROW_LEFT","ARROW_RIGHT"]
    }

    var getKeyboard = function(keyboard) {
      var keys = keyboards[keyboard]
      return {
        "fly" : ss2d.Input.Keys[keys[0]],
        "attack" : ss2d.Input.Keys[keys[1]],
        "block" : ss2d.Input.Keys[keys[2]]
      };
    }

    var get = function(options) {
      var name = options.name
        , keyboard = options.keyboard
        , c = characters[name]
        , container = new ss2d.DisplayObjectContainer(30, 150)

      // this is the character sprite
      container.guy = (new ss2d.ReelSprite(
        0,0, c.scale, c.img, 'flying'
      ))
      container.guy.container = container;
      container.addObject(container.guy)

      // Shield sprite
      container.shield = (new ss2d.Sprite(
        -30,-25,140,140, 'assets/img/bubble.png'
      ));
      container.shield.container = container;
      container.addObject(container.shield)

      return (new Character({
        name : name,
        container : container,
        keyboard : getKeyboard(keyboard)
      }));
    }
    return {
      get : get
    }
  })()

  window.Character = function(options){
    this.name = options.name;

    //Sprite Elements
    this.container = options.container;
    this.guy = this.container.guy;
    this.shield = this.container.shield;
    this.keyboard = options.keyboard;

    // container can reference Character
    this.container.character = this;
    // initial state
    this.hp = 10;
    this.invincible = 100; //start game as invincible
    this.attacking = false;
    this.blocking = false;

    // This is what Character does every tick
    this.container.tick = this.tick.bind(this);
  }

  _.extend(window.Character.prototype, EventEmitter.prototype,  {
    flap : function(){
      var currentPos = this.container.mLocation.mY;
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
        var newPos = this.container.mLocation.mY - 10;
        if (newPos >= p-10) {
          this.container.mLocation.mY = newPos;
          setTimeout(flyLooper, 15)
        }
      }).bind(this);
      flyLooper()
    },
    onPlayer : function(){
      var colliderBounds = this.container.getBounds();
      for(var childIndex in this.container.mParent.mChildren) {
        var brother = this.container.mParent.mChildren[childIndex];
        //check that the other object is not itself
        if(brother != this.container && brother.character) {
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
    attemptAttack : function(){
      var collidingWith = this.onPlayer()
      if(collidingWith){
        if(!collidingWith.blocking && !collidingWith.invincible) {
          collidingWith.takeDamage();
        }
      }
    },
    updateReelAnimations : function(deltaTime) {
      var _this = this;
      _(this.container.mChildren).each(function(obj){
        if(obj.updateReelAnimation) obj.updateReelAnimation(deltaTime);
      })
    },
    playAnimation : function(animation) {
      var shield, guy
      if('block' == animation) {
        this.shield.mAlpha = 1;
        guy = 'flying';
      } else {
        this.shield.mAlpha = 0;
        guy = animation
      }

      if(this.guy.mPlayingReel.mName != guy)
        this.guy.playReel(guy); 
    },
    tick: function(deltaTime) {
      if(!this.guy.mPlayingReel ) return;
      var input = ss2d.CURRENT_VIEW.mInput;
      var animation = 'flying';

      //update sprite reel states
      this.updateReelAnimations(deltaTime);

      // fall 5px per frame
      if(this.container.mLocation.mY < 500) {
        this.container.mLocation.mY += 2;
      }

      this.attacking = false;
      this.blocking = false;
      this.invincible = Math.max(0,this.invincible - 1);

      // only one button can be pressed during a tick
      if(input.isKeyPressed(this.keyboard.fly)) {
        this.flap()
      } else if(1 || !this.invincible) { //cant attack of block if invincible
        if (input.isKeyPressed(this.keyboard.attack)) {
          this.attacking = true;
          animation = 'attack';
        } else if(input.isKeyPressed(this.keyboard.block)) {
          this.blocking = true;
          animation = 'block'
        }
      }
      if (this.invincible){
        animation = 'invincible'
      }
      this.playAnimation(animation)

      if(this.attacking) this.attemptAttack();
    }
  })
}(_,ss2d,this)

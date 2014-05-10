!function(_,ss2d,window,undefined) {

  window.CharacterFactory= (function(){
    var characters = {
      'Blanka' : {
        "scale": 2,
        "img"  : "assets/img/blanka.reelset"
      },
      'Sonic' : {
        "scale": 4,
        "img"  : "assets/img/hedgehog.reelset"
      },
      'Azul' : {
        "scale": 0.25,
        "img"  : "assets/img/azul.reelset"
      },
      'Verde' : {
        "scale": 0.25,
        "img"  : "assets/img/verde.reelset"
      },
      'Naranja' : {
        "scale": 0.25,
        "img"  : "assets/img/naranja.reelset"
      },
      'Morado' : {
        "scale": 0.25,
        "img"  : "assets/img/morado.reelset"
      }
    }

    var keyboards = {
      "1" : ["S","A","D"],
      "2" : ["K","J","L"],
      "3" : ["X","Z","C"],
      "4" : ["N","B","M"]
    }

    var getKeyboard = function(keyboard) {
      var keys = keyboards[keyboard]
      return {
        "fly" : ss2d.Input.Keys[keys[0]],
        "attack" : ss2d.Input.Keys[keys[1]],
        "block" : ss2d.Input.Keys[keys[2]]
      };
    }
    var startingSpot = 0;
    var get = function(options) {
      var name = options.name
        , keyboard = options.keyboard
        , c = characters[name]
        , container = new ss2d.DisplayObjectContainer(30, (startingSpot++)*100)

      // this is the character sprite
      container.guy = (new ss2d.ReelSprite(
        0,0, c.scale, c.img, 'flying'
      ))
      container.attack = (new ss2d.ReelSprite(
        -60,-120, 2, 'assets/img/boom.reelset?foo'+ Math.random(), 'boom'
      ))
      container.guy.container = container;
      container.addObject(container.guy)

      // Shield sprite
      container.shield = (new ss2d.Sprite(
        -60,-60,240,240, 'assets/img/bubble.png'
      ));
      container.shield.container = container;
      container.addObject(container.shield)
      container.addObject(container.attack)

      // there are some issues with the container bounds, let us fake the bounds
      container._boundaries= (new ss2d.Rectangle(
        container.mLocation.mX,
        container.mLocation.mY,
        0,0))

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
    this.points = 0;
    this.shield = this.container.shield;
    this.attack = this.container.attack;
    this._boundaries = this.container._boundaries;
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
    setLocation : function(newPos) {
      this._boundaries.mY = this.container.mLocation.mY = newPos;
    },
    boundaries : function(){
      var fakeAssBounds = this.guy.getBounds();
      return (new ss2d.Rectangle(
        this._boundaries.mX,
        this._boundaries.mY,
        fakeAssBounds.mWidth,
        fakeAssBounds.mHeight))
    },
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
          this.setLocation(newPos)
          setTimeout(flyLooper, 15)
        }
      }).bind(this);
      flyLooper()
    },
    onPlayer : function(){
      var colliderBounds = this.boundaries(),
          collidedWith = [];
      for(var childIndex in this.container.mParent.mChildren) {
        var brother = this.container.mParent.mChildren[childIndex];
        //check that the other object is not itself
        if(brother != this.container && brother.character) {
          //if the objects collide change the direction.
          if(colliderBounds.intersectsRectangle(brother.character.boundaries())) {
            collidedWith.push(brother.character);
          }
        }
      }
      return collidedWith;
    },
    blinkInvincible : function(){
      this.invincible = 100;
    },
    addPoint : function() {
      if( !this.invincible ) {
        this.points++;
        this.emit('obstacleDodged');
      }
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
      for(var i = collidingWith.length; i--;) {
        if(!collidingWith[i].blocking && !collidingWith[i].invincible) {
          collidingWith[i].takeDamage();
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
      var shield = 0, attack = 0, guy
      if('block' == animation) {
        shield = 1;
        guy = 'flying';
      } else {
        if('attack' == animation) {
          attack = 1
        }
        guy = animation
      }
      this.shield.mAlpha = shield;
      this.attack.mAlpha = attack;

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
      if(this.container.mLocation.mY < 480) {
        this.setLocation(this.container.mLocation.mY + 2);
      }

      this.attacking = false;
      this.blocking = false;
      this.invincible = Math.max(0,this.invincible - 1);

      // only one button can be pressed during a tick
      if (input.isKeyPressed(this.keyboard.attack)) {
        this.attacking = true && !this.invincible;
        animation = 'attack';
      } else if(input.isKeyPressed(this.keyboard.block)) {
        this.blocking = true && !this.invincible;
        animation = 'block'
      } else if(input.isKeyPressed(this.keyboard.fly)) {
        this.flap()
      }

      if (this.invincible){
        animation = 'invincible'
      }
      this.playAnimation(animation)

      if(this.attacking) this.attemptAttack();
    }
  })
}(_,ss2d,this)

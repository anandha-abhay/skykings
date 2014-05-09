!function(_,ss2d,window,undefined) {
  window.ObstacleFactory = (function(){
    var nextXPosition = 900;
    var yPositions = [
      -400, -350, -300, -250, -200
    ];
    var lastIndex;
    var nextPos = function(){
      return nextXPosition;
    }
    var get = function(options) {
      var y = options.y, sprite;
      sprite = new ss2d.Sprite(nextXPosition,
                               y,
                               35,
                               1200,
                               'assets/img/pillar.png');
      nextXPosition += 500;

      return (new Obstacle({
        sprite: sprite
      }));
    };

    var getSet = function(count) {
      count = count || 10;
      var obstacles = [];
      for(var i = count; i--;) {
        obstacles.push(get({y:nextHeight()}));
      }
      return obstacles;
    }

    var nextHeight = function() {
      if(!lastIndex) {
        lastIndex = _.random(0,yPositions.length-1)
      } else {
        // prev & next are the upper and lower bounds of where the pipe can be
        var prev = Math.max(0,lastIndex - 2)
          , next = Math.min(yPositions.length - 1, lastIndex + 2)
          , newIndex = lastIndex

        // opening should not be in the same spot as last time
        while (newIndex == lastIndex ) {
          newIndex = _.random(prev,next)
        }
        lastIndex = newIndex;
      }
      return yPositions[lastIndex];
    }
    return {
      get : get,
      getSet : getSet,
      nextPos : nextPos
    };
  })();

  // Gaps are 171px tall
  // the top part of the pillar is 496px
  // the bottom part of the pillar is 533px
  // The entire sprite is 1200px tall
  window.Obstacle = function(options){
    this.speed = options.speed || 5;
    this.sprite = options.sprite;
    this.sprite.tick = this.tick.bind(this);
  };

  _.extend(Obstacle.prototype, {
    tick: function(deltaTime) {
      this.sprite.mLocation.mX -= this.speed;
      if(this.sprite.mLocation.mX < -100) {
        // subtract 800 pixels because
        // sprites disappars 100 pixels off screen
        // and started 700px onscreen
        this.sprite.mLocation.mX = ObstacleFactory.nextPos() - 800;
      }

      this.processHits();
    },

    processHits: function() {
      // Remeber sprites have a diameter of 60px
      var middle, gapLowerBound, gapUpperBound, colliderBounds;

      colliderBounds = this.sprite.getBounds();
      middle = colliderBounds.mY + 581;
      gapUpperBound = middle - 85;
      gapLowerBound = middle + 85;

      for(var childIndex in this.sprite.mParent.mChildren) {
        var brother = this.sprite.mParent.mChildren[childIndex];
        //check that the other object is not itself
        if(brother != this.sprite && brother.character) {
          //if the objects collide change the direction.
          if(colliderBounds.intersectsRectangle(brother.boundaries)) {
            var brotherYUpper = brother.mLocation.mY;
            var brotherYLower = brotherYUpper + 80;
            if(brotherYUpper < gapUpperBound || brotherYLower > gapLowerBound) {
              brother.character.takeDamage();
            }
          }
        }
      }
      return false;
    }
  });
}(_,ss2d,this);

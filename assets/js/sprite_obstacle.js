!function(_,window,undefined) {

  // Gaps are 130px tall
  // The entire sprite is 1200px tall
  window.SpriteObstacle = function(options){
    this.speed = options.speed || 5;
    this.scene = options.scene;
    this.obstacle = options.obstacle;
    this.obstacle.tick = this.tick.bind(this);
  };

  _.extend(SpriteObstacle.prototype, {
    tick: function(deltaTime) {
      this.obstacle.mLocation.mX -= this.speed;

      this.processHits();

      // when x = 0, this.scene.removeObject(this);
      // if there is a collision,
      // check where it is relative to the (Y) middle of the pillar
    },

    processHits: function() {
      // Remeber sprites have a diameter of 60px
      var middle, gapLowerBound, gapUpperBound, colliderBounds;

      colliderBounds = this.obstacle.getBounds();
      middle = colliderBounds.mY + 600;
      gapUpperBound = middle - 65;
      gapLowerBound = middle + 65;

      for(var childIndex in this.obstacle.mParent.mChildren) {
        var brother = this.obstacle.mParent.mChildren[childIndex];
        //check that the other object is not itself
        if(brother != this.obstacle && brother.character) {
          //if the objects collide change the direction.
          if(colliderBounds.intersectsRectangle(brother.getBounds())) {
            var brotherYUpper = brother.getBounds().mY;
            var brotherYLower = brother.getBounds().mY + 80;
            if(brotherYUpper > gapUpperBound && brotherYLower < gapLowerBound) {
              console.log("Pillar Miss On:" + brother.character.name);
            } else {
              brother.character.takeDamage();
              console.log("Piller Hit On:" + brother.character.name);
            }
          }
        }
      }
      return false;
    }

  });
}(_,this);

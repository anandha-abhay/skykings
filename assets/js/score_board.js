!function(_,ss2d,window,undefined) {
  window.ScoreBoard = function(){
    this.lifeMeters = []
  }
  _.extend(window.ScoreBoard.prototype, {
    add : function(player) {
      this.lifeMeters.push(new LifeMeter({player:player, y: 20, x:(this.lifeMeters.length * 200)}))
    }
  });
}(_,ss2d,this)


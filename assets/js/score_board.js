!function(_,ss2d,window,undefined) {
  window.ScoreBoard = function(){
    this.lifeMeters = []
  }
  _.extend(window.ScoreBoard.prototype, {
    add : function(player) {
      this.lifeMeters.push(new LifeMeter({player:player, y: 40, x:(this.lifeMeters.length * 400)}))
    }
  });
}(_,ss2d,this)


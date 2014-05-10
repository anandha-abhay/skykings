!function(_,ss2d,window,undefined) {
  window.ScoreBoard = function(){
    this.lifeMeters = []
    this.view = new ss2d.DisplayObjectContainer(40, 0)
  }
  _.extend(window.ScoreBoard.prototype, {
    addPlayer : function(player) {
      var meter = new LifeMeter({player:player, y: 40, x:(this.lifeMeters.length * 200)})
      this.lifeMeters.push(meter)
      this.view.addObject(meter.HPTextDisplay);
    },
    addScoreTracker : function(player) {
      // Refactor target
      var meter = new ScoreTracker({player:player, y: 40, x:(this.lifeMeters.length * 200)});
      this.lifeMeters.push(meter)
      this.view.addObject(meter.DodgeCountDisplay);
    }
  });
}(_,ss2d,this)


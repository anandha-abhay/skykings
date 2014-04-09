!function(_,ss2d,window,undefined) {
  window.ScoreBoard = function(){
    this.lifeMeters = []
    this.view = new ss2d.DisplayObjectContainer(40, 0)
  }
  _.extend(window.ScoreBoard.prototype, {
    add : function(player) {
      var meter = new LifeMeter({player:player, y: 40, x:(this.lifeMeters.length * 400)})
      this.lifeMeters.push(meter)
      this.view.addObject(meter.HPTextDisplay);
    }
  });
}(_,ss2d,this)


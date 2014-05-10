!function(_,ss2d,window,undefined) {
  window.ScoreTracker = function(options){
    this.player = options.player
    this.DodgeCountDisplay = new ss2d.TextSprite(options.x, options.y, '', '#ffffff', 24, "Comic Sans MS")
    this.adjust();
    this.player.addListener('obstacleDodged', _.bind(this.adjust,this))
  }

  _.extend(window.ScoreTracker.prototype, {
    adjust : function() {
      this.DodgeCountDisplay.mTextString = this.textString(this.player.points)
    },
    textString : function(val) {
      return [this.player.name, "Score:", val.toString()].join(' ')
    }
  })
}(_,ss2d,this)

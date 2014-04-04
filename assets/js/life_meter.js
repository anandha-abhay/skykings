!function(_,ss2d,window,undefined) {
  window.LifeMeter = function(options){
    this.player = options.player
    this.HPTextDisplay = new ss2d.TextSprite(options.x, options.y, '', '#000000', 14)
    this.adjust()
    this.player.addListener('hpAdjust', _.bind(this.adjust,this))
  }

  _.extend(window.LifeMeter.prototype, {
    adjust : function() {
      this.HPTextDisplay.mTextString = this.textString(this.player.hp)
    },
    textString : function(val) {
      return [this.player.name, "HP:", val.toString()].join(' ')
    }
  })
}(_,ss2d,this)

cc.Class({
    extends: cc.Component,
    properties: {
        // speed: 0.5,
        // progressBarView: {
        //     type: cc.ProgressBar,
        //     default: null
        // },
        loadingLabel: cc.Label,
        progressSprite: cc.Sprite,
    
    },
    onLoad: function() {
        
        cc.director.preloadScene("Home", function(complete, total, item) {
            var per = complete / total;
            this.progressSprite.fillStart = 0;
            this.progressSprite.fillRange = per;
            this.loadingLabel.string = `Loading ${Math.floor(per *100)}%`;
            
        }.bind(this), function(err, ass) {
            if (!err) {
                cc.director.loadScene("Home");
                
            }
        });
        // this._ping = true;
        // this.progressBarView.progress = 0;
    },
    // update: function(dt) {
    //     // this._updateProgressBar(this.progressBarView, dt);
    // },
    // _updateProgressBar: function(progressBar, dt) {
        
    //     var progress = progressBar.progress;
    //     if (progress < 1.0 && this._ping) {
    //         progress += dt * this.speed;
    //         progressBar.progress = progress;
    //     }
    //     if (progress > 1.0) {
    //         cc.director.loadScene("Home");
    //     }

    // },
});
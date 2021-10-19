var Linker = require("Linker");
cc.Class({
    extends: cc.Component,

    properties: {
        btnStart: cc.Node,
        result: cc.Label,
        txtTimeEnd: cc.Label,
        txtBomb: cc.Label,
        txtDisposal: cc.Label,
        txtLevel: cc.Label,
        aniVictory: cc.Node,
        aniFail: cc.Node,
        btnClose: cc.Node,
        btnResume: cc.Node,

    },

    onLoad: function() {

    },
    AdsDone() {
        cc.error("QUANG CAO O BUTTON TIEP TUC XONG ROI< CONG TIEN DI");
    },
    showWin() {
        this.result.string = "VICTORY!";
        this.aniVictory.active = true;
    },
    showFail() {
        this.result.string = "FAIL...";
        this.aniFail.active = true;

    },
    onBtnStart: function() {
        this.node.getComponent("AudioManagement").playEffectSound("click", false);
        var b = this.getComponent("popUp");
        b.hide();
        var a = this.node.parent.getComponent("Game");
        a.newGame();
    },
    onBtnClose() {
        this.node.getComponent("AudioManagement").playEffectSound("click", false);
        var b2 = this.getComponent("popUp");
        b2.hide();
        var a2 = this.node.parent.getComponent("Game");
        a2.restartGame2();
    },
   
    setTimeEnd(timeEnd) {
        var day = Math.floor(timeEnd / (24 * 60 * 60 * 1000));
        var h = timeEnd % (24 * 60 * 60 * 1000);
        var hour = Math.floor(h / (60 * 60 * 1000));
        var m = h % (1000 * 60 * 60);
        var minutes = Math.floor(m / (1000 * 60));
        var s = m % (1000 * 60);
        var seconds = Math.floor(s / 1000);
        timeEnd = this.formatData(minutes) + ":" + this.formatData(seconds);

        this.txtTimeEnd.string = timeEnd;
    },
    formatData(time) {
        if (time <= 0) {
            return "00";
        } else {
            if (time < 10) {
                return "0" + time;
            } else {
                return "" + time;
            }
        }
    },
    getBomb(bomb) {
        this.txtBomb.string = bomb;
    },
    disposalBomb() {
        this.txtDisposal.string = this.node.parent.getComponent("Game").countDisposalBomb();
    },
    setLevel() {
        if (this.txtBomb.string == 18) {
            this.txtLevel.string = "Normal";
        }
        if (this.txtBomb.string == 12) {
            this.txtLevel.string = "Easy";
        }
        if (this.txtBomb.string == 24) {
            this.txtLevel.string = "Hard";
        }
    },
    onBtnResume() {
        this.node.getComponent("AudioManagement").playEffectSound("click", false);
        Linker.MySdk.setDataActionAds({action: 1,script: this});
        Linker.MySdk.showInterstitial();
        // Linker.MySdk.test();
        var b3 = this.getComponent("popUp");
        b3.hide();
        var a2 = this.getComponent("loadScene");
        var a3 = this.node.parent.getComponent("Game");
        if(this.txtLevel.string == "Easy"){
            a2.loadMapLua();
        }
        if(this.txtLevel.string == "Normal"){
            a2.loadMapBang();
        }
        if(this.txtLevel.string == "Hard"){
            a3.onBtnShow();
        }
    },

});
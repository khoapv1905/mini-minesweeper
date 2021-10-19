cc.Class({
    extends: cc.Component,

    properties: {
        btnResume: cc.Node,
        btnRestart: cc.Node,
        btnBack: cc.Node,
        btnSoundOn: cc.Node,
        btnSoundOff: cc.Node,

    },
    onLoad(){
        let soundData = JSON.parse(cc.sys.localStorage.getItem("soundOff"));
        if(soundData == false){
            this.btnSoundOn.active = false;
            this.btnSoundOff.active = true;
        }else{
            this.btnSoundOn.active = true;
            this.btnSoundOff.active = false;
        }
    },
    onBtnResume() {
        var r = this.node.parent.getComponent("Game");
        r.resumeGame();
        var r2 = this.getComponent("popUp");
        r2.hide();
    },
    onBtnRestart() {
        var a2 = this.getComponent("popUp");
        a2.hide();
        var a = this.node.parent.getComponent("Game");
        //a.resetTime();
        a.newGame();
        a.restartGame();

    },
    onBtnBack() {
        var b2 = this.getComponent("loadScene");
        b2.loadLobby();
        var b = this.getComponent("popUp");
        b.hide();
    },
    onBtnSoundOn(){
        this.btnSoundOn.active = false;
        this.btnSoundOff.active = true;
        let canvas = cc.find("/Canvas").getComponent("AudioManagement");
        canvas._isPlaying = false;
        cc.sys.localStorage.setItem("soundOff", JSON.stringify(false));
    },
    onBtnSoundOff(){
        this.btnSoundOn.active = true;
        this.btnSoundOff.active = false;
        let canvas = cc.find("/Canvas").getComponent("AudioManagement");
        canvas._isPlaying = true;
        cc.sys.localStorage.setItem("soundOff", JSON.stringify(true));
    },
    ClickSound(){
        let audioScript = cc.find("/Canvas").getComponent("AudioManagement");
        if(audioScript){
            audioScript.playEffectSound("click", false);
        }
    }
});
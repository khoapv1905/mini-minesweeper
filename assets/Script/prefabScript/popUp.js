cc.Class({
    extends: cc.Component,
    properties: {
        facebookConnect:"",
    },
    show() {
        this.node.active = true;
        this.node.opacity = 0;
        this.node.scale = 0.2;
        cc.tween(this.node)
            .to(0.5, { scale: 1, opacity: 255 }, { easing: "backInOut" })
            .start();


    },
    hide() {
        cc.tween(this.node)
            .to(0.5, { scale: 0.2, opacity: 0 }, { easing: "backInOut" })
            .call(() => { this.node.active = false; })
            .start();

    },
    faceBook_connect() {
        if(cc.sys.isBrowser){
            cc.sys.openURL(this.facebookConnect);
        }
        
    },
    feedBack() {

    },
    ClickSoundPopUp(){
        let audioScript = cc.find("/Canvas").getComponent("AudioManagement");
        if(audioScript){
            //audioScript.playEffectSound("click", false);
            audioScript.playEffectSound("popUp", false);
        }
    },
    clickSound(){
        let audioScript = cc.find("/Canvas").getComponent("AudioManagement");
        if(audioScript){
            audioScript.playEffectSound("click", false);
            //audioScript.playEffectSound("popUp", false);
        }
    }

});
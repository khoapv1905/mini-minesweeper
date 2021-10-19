cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    loadLobby() {
        this.ClickSound();
        cc.director.loadScene("Lobby");
    },
    loadMapBang() {
        this.ClickSound();
        cc.director.loadScene("mapBang");
        cc.sys.localStorage.setItem("mapId", JSON.stringify(1));
    },
    loadMapLua() {
        this.ClickSound();
        cc.director.loadScene("mapLua");
        cc.sys.localStorage.setItem("mapId", JSON.stringify(2));
    },
    loadMapRung() {
        this.ClickSound();
        cc.director.loadScene("mapRung");
        cc.sys.localStorage.setItem("mapId", JSON.stringify(3));
    },
    loadHome() {
        this.ClickSound();
        cc.director.loadScene("Home");
    },

    ClickSound(){
        let audioScript = cc.find("/Canvas").getComponent("AudioManagement");
        if(audioScript){
            audioScript.playEffectSound("clickMap", false);
        }
    }
});
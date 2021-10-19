var SdkBoxUtil = require('SdkBoxUtil');
var Linker = require("Linker");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Linker.PluginSdkboxPlay = this;
    },

    onEnable() {

    },
    onDisable() {

    },
    start() {

    },
    showLeaderboard: function () {
        console.log("showLeaderboard");
        if ("undefined" == typeof (sdkbox)) {
            console.log("sdkbox is not exist");
            return
        }

        if ("undefined" != typeof (sdkbox.PluginSdkboxPlay)) {
            console.log("vao showLeaderboard");
            var plugin = sdkbox.PluginSdkboxPlay;
            if (!plugin.isSignedIn()) {
                SdkBoxUtil.googleLogin();
            }
            plugin.showLeaderboard("ldb1");
        }
    },
    submitCore: function (money = 1) {
        console.log("sdkboxPlayInit");
        if ("undefined" == typeof (sdkbox)) {
            console.log("sdkbox is not exist");
            return
        }

        if ("undefined" != typeof (sdkbox.PluginSdkboxPlay)) {
            console.log("ok send submitCore");
            sdkbox.PluginSdkboxPlay.submitScore("ldb1", money);
        }
    },
    btnShareFB: function () {
        Linker.showMessage("Share game....");
        if ("undefined" == typeof (sdkbox)) {
            console.log("sdkbox is not exist")
            return
        }
        // if ("undefined" != typeof (sdkbox.PluginFacebook)) {
        //     var info = new Object();
        //     info.type = "link";
        //     info.link = "https://play.google.com/store/apps/details?id=com.zepplay.tienlenoffline";
        //     info.title = "Tiến lên Miền Nam";
        //     info.text = "Zep Tiến lên - Tien Len Mien Nam";
        //     info.image = "https://i.ibb.co/jk1YYt4/playstore-icon.png";
        //     sdkbox.PluginFacebook.dialog(info);
        // }
       
      
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            var str = "Chơi TLMN Miễn Phí: https://play.google.com/store/apps/details?id=com.zepplay.tienlenoffline";
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "shareData", "(Ljava/lang/String;)V",str);
        }
        else if (cc.sys.os == cc.sys.OS_IOS) {
            //jsb.reflection.callStaticMethod("AppController", "shareData");
        }
    
           
      
    }
});

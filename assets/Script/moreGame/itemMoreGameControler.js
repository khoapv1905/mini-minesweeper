cc.Class({
    extends: cc.Component,

    properties: {
        avatar: cc.Sprite,
        txt_name: cc.Label,
        listAvatarGame: cc.SpriteAtlas

    },

    start() {

    },
    showData(data) {
        // console.log(data);
        this.data = data;
        this.txt_name.string = data.name.vi;
        var sprite = this.listAvatarGame.getSpriteFrame(data.avatar.split(".")[0]);
        if (sprite) {
            this.avatar.spriteFrame = sprite;
        }
    },
    btnDownOnClick() {
        console.log(this.data.url);
        cc.sys.openURL(this.data.url);
    }

    // update (dt) {},
});
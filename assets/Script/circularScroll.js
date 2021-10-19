cc.Class({
    extends: cc.Component,

    properties: {
        revolveTime: 0.8,
        point_blue: cc.Node,
        point_green: cc.Node,
        point_yellow: cc.Node,
    },
    onLoad() {
        let getIdMap = JSON.parse(cc.sys.localStorage.getItem("mapId"));
        this.attrArray = [
            JSON.stringify({
                zIndex: 3,
                scale: 1,
                opacity: 255,
                pos: this.node.children[0].position
            }),
            JSON.stringify({
                zIndex: 2,
                scale: 0.3,
                opacity: 255,
                pos: this.node.children[1].position
            }),
            JSON.stringify({
                zIndex: 1.9,
                scale: 0.3,
                opacity: 255,
                pos: this.node.children[2].position
            }),
        ]
        this.cardsArray = this.node.children;
        for (let i = 0; i < this.cardsArray.length; i++) {
            this.cardsArray[i].num = i;
            let initAttr = JSON.parse(this.attrArray[i]);
            this.cardsArray[i].zIndex = initAttr['zIndex'];
            this.cardsArray[i].scale = initAttr['scale'];
            this.cardsArray[i].opacity = initAttr['opacity'];
            this.cardsArray[i].pos = initAttr['pos'];
        }
        this.node.on('touchmove', this.onTouchMove, this);
        this.point_green.getChildByName("indicator1").active = false;
        this.point_blue.getChildByName("indicator2").active = true;
        this.point_yellow.getChildByName("indicator3").active = false;
        if(getIdMap == 2){
            this.onTouchMove2(null, -50);
            this.point_green.getChildByName("indicator1").active = false;
            this.point_blue.getChildByName("indicator2").active = false;
            this.point_yellow.getChildByName("indicator3").active = true; 
        }else if(getIdMap == 3){
            this.onTouchMove2(null, 50);
            this.point_green.getChildByName("indicator1").active = true;
            this.point_blue.getChildByName("indicator2").active = false;
            this.point_yellow.getChildByName("indicator3").active = false;
        }
    },
    onTouchMove(event) {
        for (let i = 0; i < this.cardsArray.length; i++) {
            if (this.cardsArray[i].getActionByTag(1))
                return;
        }
        let deltaX = event.getDelta().x;
        if (deltaX > this.node.parent.width / 40) {
            this.revolve2Right(this.revolveTime);
        } else if (deltaX < -this.node.parent.width / 40) {
            this.revolve2Left(this.revolveTime);
        }
    },
    onTouchMove2(event, deltaX) {
        for (let i = 0; i < this.cardsArray.length; i++) {
            if (this.cardsArray[i].getActionByTag(1))
                return;
        }
        // let deltaX = event.getDelta().x;
        if (deltaX > this.node.parent.width / 40) {
            this.revolve2Right(0);
        } else if (deltaX < -this.node.parent.width / 40) {
            this.revolve2Left(0);
        }
    },
    revolve2Right(revolveTime) {
        for (let i = 0; i < this.cardsArray.length; i++) {
            if (this.cardsArray[i].num < this.cardsArray.length - 1)
                this.cardsArray[i].num += 1;
            else
                this.cardsArray[i].num = 0;
            let nextAttr = JSON.parse(this.attrArray[this.cardsArray[i].num]);
            this.cardsArray[i].zIndex = nextAttr['zIndex'];

            let scaleAction = cc.scaleTo(revolveTime, nextAttr['scale']);
            let fadeAction = cc.fadeTo(revolveTime, nextAttr['opacity']);
            let moveAction = cc.moveTo(revolveTime, nextAttr['pos']);
            let spawnAction = cc.spawn(scaleAction, fadeAction, moveAction);
            spawnAction.setTag(1);
            this.cardsArray[i].runAction(spawnAction);
            this.node.getComponent("AudioManagement").playEffectSound("scrollMap", false);
            switch (this.cardsArray[0]._name) {
                case "mapBang":
                    this.point_blue.getChildByName("indicator2").active = true;
                    this.point_green.getChildByName("indicator1").active = false;
                    this.point_yellow.getChildByName("indicator3").active = false;
                    break;
                case "mapRung":
                    this.point_green.getChildByName("indicator1").active = true;
                    this.point_blue.getChildByName("indicator2").active = false;
                    this.point_yellow.getChildByName("indicator3").active = false;
                    break;
                case "mapLua":
                    this.point_yellow.getChildByName("indicator3").active = true;
                    this.point_green.getChildByName("indicator1").active = false;
                    this.point_blue.getChildByName("indicator2").active = false;
                    break;
            }
        }
    },
    revolve2Left(revolveTime) {
        for (let i = 0; i < this.cardsArray.length; i++) {

            if (this.cardsArray[i].num > 0)
                this.cardsArray[i].num -= 1;
            else
                this.cardsArray[i].num = this.cardsArray.length - 1;
            let nextAttr = JSON.parse(this.attrArray[this.cardsArray[i].num]);
            this.cardsArray[i].zIndex = nextAttr['zIndex'];

            let scaleAction = cc.scaleTo(revolveTime, nextAttr['scale']);
            let fadeAction = cc.fadeTo(revolveTime, nextAttr['opacity']);
            let moveAction = cc.moveTo(revolveTime, nextAttr['pos']);
            let spawnAction = cc.spawn(scaleAction, fadeAction, moveAction);
            spawnAction.setTag(1);
            this.cardsArray[i].runAction(spawnAction);
            this.node.getComponent("AudioManagement").playEffectSound("scrollMap", false);
            switch (this.cardsArray[1]._name) {
                case "mapBang":
                    this.point_blue.getChildByName("indicator2").active = true;
                    this.point_green.getChildByName("indicator1").active = false;
                    this.point_yellow.getChildByName("indicator3").active = false;
                    break;
                case "mapLua":
                    this.point_yellow.getChildByName("indicator3").active = true;
                    this.point_green.getChildByName("indicator1").active = false;
                    this.point_blue.getChildByName("indicator2").active = false;
                    break;
                case "mapRung":
                    this.point_green.getChildByName("indicator1").active = true;
                    this.point_blue.getChildByName("indicator2").active = false;
                    this.point_yellow.getChildByName("indicator3").active = false;
                    break;
            }
        }
    },
});
const GAME_STATE = cc.Enum({
    PREPARE: -1,
    PLAY: -1,
    DEAD: -1,
    WIN: -1
});
const TOUCH_STATE = cc.Enum({
    BLANK: -1,
    FLAG: -1,
});


var Linker = require('Linker');
cc.Class({
    extends: cc.Component,


    properties: {
        tilesLayout: cc.Node,
        tile: cc.Prefab,
        AdsNodeController: cc.Prefab,
        tiles: [],
        endGame: cc.Prefab,
        pauseBack: cc.Prefab,
        textTime: cc.Label,
        countBomb: cc.Label,
        btnPause: cc.Node,
        btnPlay: cc.Node,
        btnRestart: cc.Node,
        black: cc.Node,
        gameState: {
            default: GAME_STATE.PREPARE,
            type: GAME_STATE,
        },
        touchState: {
            default: TOUCH_STATE.BLANK,
            type: TOUCH_STATE,
        },
        isClick: {
            default: false,
        },
        clickEvent: {
            default: null,
            type: cc.Component.EventHandler,
            visible() {
                return this.isClick;
            },
        },
        maxOffTime: {
            default: 400,
            visible() {
                return this.isDoubleClick;
            },
        },
        isLongTouch: {
            default: false,
        },
        minTouchTime: {
            default: 2000,
            visible() {
                return this.isLongTouch;
            },
        },
        longTouchEvent: {
            default: null,
            type: cc.Component.EventHandler,
            visible() {
                return this.isLongTouch;
            },
        },
        backgroundAudio:{
            default:null,
            type: cc.AudioClip,
        },
        _touchState: false,
        _touchTime: 0,
        _clickState: false,
        _offTime: 0,
        row: 0,
        col: 0,
        bombNum: 0,
        // listInter: [],
        timeCount: 0,
        isPlaying: false,
    },
    ctor() {
        this.clickEvent = new cc.Component.EventHandler();
        this.doubleClickEvent = new cc.Component.EventHandler();
    },
    onLoad: function () {
        //this.countBomb = null;
        var Ads = cc.instantiate(this.AdsNodeController);
        if (Ads) {
            this.node.addChild(Ads);
        }
        this.Tile = require("Tile");
        var self = this;
        for (let y = 0; y < this.row; y++) {
            for (let x = 0; x < this.col; x++) {
                let tile = cc.instantiate(this.tile);
                tile.name = String(y * this.col + x);
                tile.on(cc.Node.EventType.TOUCH_START, function (event) {
                        this._touchState = true;
                        this._touchTime = 0;
                    },
                    this
                );
                tile.on(cc.Node.EventType.TOUCH_END, function (event) {
                        this._touchState = false;
                        if (this._touchTime < this.minTouchTime) {
                            this._clickState = true;
                            this.scheduleOnce(function () {
                                this._offTime = 0;
                                this._clickState = false;
                                self.touchState = TOUCH_STATE.BLANK;
                                self.onTouchTile(tile);
                            }, this.maxOffTime / 1000);
                        } else {
                            if (this.isLongTouch) {
                                self.touchState = TOUCH_STATE.FLAG;
                                self.onTouchTile(tile);
                            }
                        }
                        this._touchTime = 0;
                    },
                    this
                );
                this.tilesLayout.addChild(tile);
                this.tiles.push(tile);
            }
        }
        this.newGame();
        Linker.MySdk.showInterstitial();
    },

    update(dt) {
        if (this._touchState) {
            this._touchTime = this._touchTime + dt * 1000;
        }
        if (this._clickState) {
            this._offTime = this._offTime + dt * 1000;
        }
    },
    clickCallBack: function (data) {
        console.log("click", data);
    },
    longTouchCallBack: function (data) {
        console.log("long press", data);
    },
    AdsDone() {
        cc.error("QUANG CAO XONG ROI< CONG TIEN DI");
    },
    newGame: function () {
        this.currentBomb = this.bombNum;
        Linker.MySdk.setDataActionAds({
            action: 1,
            script: this
        });
        // Linker.MySdk.showRewarded();
        // Linker.MySdk.test();
        
        //init game
        this.timeCount = 0;
        this.isPlaying = true;
        for (let n = 0; n < this.tiles.length; n++) {
            this.tiles[n].getComponent("Tile").type = this.Tile.TYPE.ZERO;
            this.tiles[n].getComponent("Tile").state = this.Tile.STATE.NONE;
        }
        //add mines
        var tilesIndex = [];
        for (var i = 0; i < this.tiles.length; i++) {
            tilesIndex[i] = i;
        }
        for (var j = 0; j < this.bombNum; j++) {
            var n = Math.floor(Math.random() * tilesIndex.length);
            this.tiles[tilesIndex[n]].getComponent("Tile").type = this.Tile.TYPE.BOMB_REVEALED;
            tilesIndex.splice(n, 1);
        }
        //Mark the tiles around the mine
        for (var k = 0; k < this.tiles.length; k++) {
            var tempBomb = 0;
            if (this.tiles[k].getComponent("Tile").type == this.Tile.TYPE.ZERO) {
                var roundTiles = this.tileRound(k);
                for (var m = 0; m < roundTiles.length; m++) {
                    if (roundTiles[m].getComponent("Tile").type == this.Tile.TYPE.BOMB_REVEALED) {
                        tempBomb++;
                    }
                }
                this.tiles[k].getComponent("Tile").type = tempBomb;
            }
        }
        this.gameState = GAME_STATE.PLAY;
        this.black.active = false;
        //this.btnShow.getComponent(cc.Sprite).spriteFrame = this.picPlay;
        //start time up
        this.countDownGamePlay(this.textTime);
        this.countTotalBombs(this.countBomb);

    },
    tileRound: function (i) {
        var roundTiles = [];
        if (i % this.col > 0) { //left
            roundTiles.push(this.tiles[i - 1]);
        }
        if (i % this.col > 0 && Math.floor(i / this.col) > 0) { //left top
            roundTiles.push(this.tiles[i - this.col - 1]);
        }
        if (i % this.col > 0 && Math.floor(i / this.col) < this.row - 1) { //left bottom
            roundTiles.push(this.tiles[i + this.col - 1]);
        }
        if (Math.floor(i / this.col) > 0) { //bottom
            roundTiles.push(this.tiles[i - this.col]);
        }
        if (Math.floor(i / this.col) < this.row - 1) { //top
            roundTiles.push(this.tiles[i + this.col]);
        }
        if (i % this.col < this.col - 1) { //right
            roundTiles.push(this.tiles[i + 1]);
        }
        if (i % this.col < this.col - 1 && Math.floor(i / this.col) > 0) { //right top
            roundTiles.push(this.tiles[i - this.col + 1]);
        }
        if (i % this.col < this.col - 1 && Math.floor(i / this.col) < this.row - 1) { //right bottom
            roundTiles.push(this.tiles[i + this.col + 1]);
        }
        return roundTiles;
    },

    onTouchTile: function (touchTile) {
        // check boom
        if (this.isPlaying) {
            if (this.gameState != GAME_STATE.PLAY) {
                return;
            }
            switch (this.touchState) {
                case TOUCH_STATE.BLANK:
                    if (touchTile.getComponent("Tile").type === this.Tile.TYPE.BOMB_REVEALED && touchTile.getComponent("Tile").state !== this.Tile.STATE.FLAG) {
                        touchTile.getComponent("Tile").type = this.Tile.TYPE.BOMB_DEATH;
                        touchTile.getComponent("Tile").state = this.Tile.STATE.CLICKED;
                        this.node.getComponent("AudioManagement").playEffectSound("explore", false);
                        this.gameOver();
                        return;
                    }
                    var testTiles = [];
                    if (touchTile.getComponent("Tile").state === this.Tile.STATE.NONE) {
                        this.node.getComponent("AudioManagement").playEffectSound("touch", false);
                        testTiles.push(touchTile);
                        while (testTiles.length) {
                            var testTile = testTiles.pop();
                            if (testTile.getComponent("Tile").type === 0) {
                                testTile.getComponent("Tile").state = this.Tile.STATE.CLICKED;
                                var roundTiles = this.tileRound(parseInt(testTile.name));
                                //debugger
                                for (var i = 0; i < roundTiles.length; i++) {
                                    if (roundTiles[i].getComponent("Tile").state == this.Tile.STATE.NONE) {
                                        //debugger
                                        testTiles.push(roundTiles[i]);
                                    }
                                }
                            } else if (testTile.getComponent("Tile").type > 0 && testTile.getComponent("Tile").type < 4) {
                                //debugger
                                testTile.getComponent("Tile").state = this.Tile.STATE.CLICKED;
                            }
                        }
                        this.judgeWin();
                    }
                    break;
                case TOUCH_STATE.FLAG:
                    if (touchTile.getComponent("Tile").state === this.Tile.STATE.NONE) {
                        touchTile.getComponent("Tile").state = this.Tile.STATE.FLAG;
                        this.countBombFlag(touchTile);
                    } else if (touchTile.getComponent("Tile").state === this.Tile.STATE.FLAG) {
                        touchTile.getComponent("Tile").state = this.Tile.STATE.NONE;
                        this.countBombFlag(touchTile);
                    }
                    break;
                default:
                    break;
            }
        }
    },
    judgeWin: function () {
        var confNum = 0;
        for (let i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].getComponent("Tile").state === this.Tile.STATE.CLICKED) {
                confNum++;
            }
        }
        if (confNum === this.tiles.length - this.bombNum) {
            this.countDisposalBomb();
            this.gameState = GAME_STATE.WIN;
            //this.btnShow.getComponent(cc.Sprite).spriteFrame = this.picWin;
            clearInterval(this.timeGetVip);
            var newEndGame = cc.instantiate(this.endGame);

            var eg = newEndGame.getComponent("popUp");
            if (eg) {
                this.black.active = true;
                eg.show();
            }
            this.node.addChild(newEndGame);
            var endGameScript = newEndGame.getComponent("endGame");
            if (endGameScript) {
                endGameScript.setTimeEnd(this.timeCount);
                endGameScript.showWin();
                this.node.getComponent("AudioManagement").playEffectSound("win", false);
                endGameScript.getBomb(this.bombNum);
                endGameScript.disposalBomb(this.count);
                endGameScript.setLevel();
            }
            this.bombNum++;
        }


    },
    gameOver: function () {
        console.log("mo tat ca bom");
        for (let i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].getComponent("Tile").type === this.Tile.TYPE.BOMB_REVEALED && this.tiles[i].getComponent("Tile").state !== this.Tile.STATE.FLAG) {
                this.tiles[i].getComponent("Tile").state = this.Tile.STATE.CLICKED;
            }

        }
        this.gameState = GAME_STATE.DEAD;
        this.node.getComponent("AudioManagement").playEffectSound("fail", false);
        Linker.MySdk.setDataActionAds({
            action: 1,
            script: this
        });
        // Linker.MySdk.showRewarded();
        // Linker.MySdk.test();
        //Linker.MySdk.showInterstitial();
        //popUp EndGame
        var newEndGame = cc.instantiate(this.endGame);
        var eg = newEndGame.getComponent("popUp");
        if (eg) {
            this.black.active = true;
            eg.show();
        }
        this.node.addChild(newEndGame);
        var endGameScript = newEndGame.getComponent("endGame");
        if (endGameScript) {
            endGameScript.setTimeEnd(this.timeCount);
            endGameScript.showFail();
            endGameScript.getBomb(this.bombNum);
            endGameScript.disposalBomb(this.count);
            endGameScript.setLevel();
        }

    },


    onBtnShow: function () {
        if (this.gameState === GAME_STATE.DEAD) {
            // this.bombNum--;
            this.newGame();
        }
        if (this.gameState === GAME_STATE.WIN) {
            this.bombNum++;
            this.newGame();
        }
    },
    countDownGamePlay(lbCountUp) {
        var _this = this;
        this.timeGetVip = setInterval(() => {
            // if (!cc.isValid(_this)) {
            //     clearInterval(_this.timeGetVip);
            //     _this.timeGetVip = null;
            //     return;
            // }
            var day = Math.floor(this.timeCount / (24 * 60 * 60 * 1000));
            var h = this.timeCount % (24 * 60 * 60 * 1000);
            var hour = Math.floor(h / (60 * 60 * 1000));
            var m = h % (1000 * 60 * 60);
            var minutes = Math.floor(m / (1000 * 60));
            var s = m % (1000 * 60);
            var seconds = Math.floor(s / 1000);
            // if (minutes < 0) {
            //     lbCountDown.string  = this.formatData(minutes) + ":" + this.formatData(seconds);
            // } else {
            lbCountUp.string = this.formatData(minutes) + ":" + this.formatData(seconds);
            // }
            this.timeCount += 1000;
            if (_this.gameState === GAME_STATE.DEAD || _this.gameState === GAME_STATE.WIN) {
                clearInterval(_this.timeGetVip);
            }
        }, 1000);
        //this.listInter.push(this.timeGetVip);
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
    resetTime() {
        countDownGamePlay(0);
        if (this.timeGetVip) {
            clearInterval(this.timeGetVip);
        }
    },
    countTotalBombs() {
        this.countBomb.string = this.bombNum.toString();
        
    },
    countBombFlag(touchTile){
        let tileScript = touchTile.getComponent("Tile");
        if (tileScript) {
            if (tileScript.state == this.Tile.STATE.FLAG) {
                    var subBomb = --this.currentBomb;
                    this.countBomb.string = subBomb.toString();
            }else if (tileScript.state == this.Tile.STATE.NONE){
                    var addBomb = ++this.currentBomb;
                    this.countBomb.string = addBomb.toString();  
            }
        }
    },
    pauseGame() {
        this.node.getComponent("AudioManagement").playEffectSound("click", false);
        this.black.active = true;
        this.btnPause.active = false;
        this.btnPlay.active = true;
        this.isPlaying = false;
        clearInterval(this.timeGetVip);
        var newPauseBack = cc.instantiate(this.pauseBack);
        var pb = newPauseBack.getComponent("popUp");
        if (pb) {
            pb.show();
        }
        this.node.addChild(newPauseBack);

    },

    resumeGame() {
        this.node.getComponent("AudioManagement").playEffectSound("click", false);
        this.black.active = false;
        this.btnPlay.active = false;
        this.btnPause.active = true;
        this.countDownGamePlay(this.textTime);
        this.isPlaying = true;
    },
    countDisposalBomb() {
        var count = 0;
        for (let i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].getComponent("Tile").type === this.Tile.TYPE.BOMB_REVEALED && this.tiles[i].getComponent("Tile").state === this.Tile.STATE.FLAG) {
                count++;
            }
        }
        return count;
    },
    restartGame() {
        this.node.getComponent("AudioManagement").playEffectSound("click", false);
        this.btnPlay.active = false;
        this.btnPause.active = true;
        this.black.active = false;
    },
    restartGame2() {
        this.node.getComponent("AudioManagement").playEffectSound("click", false);
        this.btnRestart.active = true;
        this.btnPlay.active = false;
        this.btnPause.active = false;
        this.black.active = false;
        
        
    },
    onBtnRestart() {
        this.node.getComponent("AudioManagement").playEffectSound("click", false);
        this.newGame();
        this.btnPause.active = true;
        this.btnRestart.active = false;
        this.btnPlay.active = false;
        this.black.active = false;
    },
});
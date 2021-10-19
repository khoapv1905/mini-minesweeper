window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  AudioManagement: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d1624wDoeVMMp9phmsN/wrU", "AudioManagement");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        loop: true,
        soundVolume: {
          default: 1,
          range: [ 0, 1, .1 ],
          slide: true,
          notify: function notify() {
            this.setVolume();
          }
        },
        AudioClipPool: {
          default: [],
          type: cc.AudioClip
        },
        _isPlaying: true,
        _audioId: null,
        _effectId: null
      },
      onLoad: function onLoad() {
        var soundData = JSON.parse(cc.sys.localStorage.getItem("soundOff"));
        if (null != soundData) this._isPlaying = soundData; else {
          soundData = true;
          this._isPlaying = soundData;
        }
      },
      playEffectSound: function playEffectSound(command, loop) {
        if (null === loop && void 0 === loop) var loop = this.loop;
        if (!this._isPlaying) return;
        if (null !== command || void 0 !== command) switch (command) {
         case "clickMap":
          this._effectId = cc.audioEngine.playEffect(this.AudioClipPool[0], loop);
          break;

         case "popUp":
          this._effectId = cc.audioEngine.playEffect(this.AudioClipPool[1], loop);
          break;

         case "win":
          this._effectId = cc.audioEngine.playEffect(this.AudioClipPool[2], loop);
          break;

         case "fail":
          this._effectId = cc.audioEngine.playEffect(this.AudioClipPool[3], loop);
          break;

         case "touch":
          this._effectId = cc.audioEngine.playEffect(this.AudioClipPool[4], loop);
          break;

         case "click":
          this._effectId = cc.audioEngine.playEffect(this.AudioClipPool[5], loop);
          break;

         case "scrollMap":
          this._effectId = cc.audioEngine.playEffect(this.AudioClipPool[6], loop);
          break;

         default:
          cc.error("command is invalid");
        }
      },
      stopAll: function stopAll() {
        if (!this._isPlaying) return;
      }
    });
    cc._RF.pop();
  }, {} ],
  Constant: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "664b01Jv85AVbuPFrP9gR4B", "Constant");
    "use strict";
    exports.__esModule = true;
    exports.Constant = void 0;
    var Constant = {
      GameMode: {
        ScoreMode: "ScoreMode",
        CoinMode: "CoinsMode",
        DemLaMode: "DemLaMode",
        NhatAnTatMode: "NhatAnTatMode"
      },
      PLAYER: {
        _2: "TWO",
        _3: "THREE",
        _4: "FOUR"
      },
      CurrentPlayer: "",
      CurrentGameMode: ""
    };
    exports.Constant = Constant;
    cc._RF.pop();
  }, {} ],
  Game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9212ahoqqZMFIZNyUnOM+P+", "Game");
    "use strict";
    var GAME_STATE = cc.Enum({
      PREPARE: -1,
      PLAY: -1,
      DEAD: -1,
      WIN: -1
    });
    var TOUCH_STATE = cc.Enum({
      BLANK: -1,
      FLAG: -1
    });
    var Linker = require("Linker");
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
          type: GAME_STATE
        },
        touchState: {
          default: TOUCH_STATE.BLANK,
          type: TOUCH_STATE
        },
        isClick: {
          default: false
        },
        clickEvent: {
          default: null,
          type: cc.Component.EventHandler,
          visible: function visible() {
            return this.isClick;
          }
        },
        maxOffTime: {
          default: 400,
          visible: function visible() {
            return this.isDoubleClick;
          }
        },
        isLongTouch: {
          default: false
        },
        minTouchTime: {
          default: 2e3,
          visible: function visible() {
            return this.isLongTouch;
          }
        },
        longTouchEvent: {
          default: null,
          type: cc.Component.EventHandler,
          visible: function visible() {
            return this.isLongTouch;
          }
        },
        backgroundAudio: {
          default: null,
          type: cc.AudioClip
        },
        _touchState: false,
        _touchTime: 0,
        _clickState: false,
        _offTime: 0,
        row: 0,
        col: 0,
        bombNum: 0,
        timeCount: 0,
        isPlaying: false
      },
      ctor: function ctor() {
        this.clickEvent = new cc.Component.EventHandler();
        this.doubleClickEvent = new cc.Component.EventHandler();
      },
      onLoad: function onLoad() {
        var _this2 = this;
        var Ads = cc.instantiate(this.AdsNodeController);
        Ads && this.node.addChild(Ads);
        this.Tile = require("Tile");
        var self = this;
        for (var y = 0; y < this.row; y++) {
          var _loop = function _loop(x) {
            var tile = cc.instantiate(_this2.tile);
            tile.name = String(y * _this2.col + x);
            tile.on(cc.Node.EventType.TOUCH_START, function(event) {
              this._touchState = true;
              this._touchTime = 0;
            }, _this2);
            tile.on(cc.Node.EventType.TOUCH_END, function(event) {
              this._touchState = false;
              if (this._touchTime < this.minTouchTime) {
                this._clickState = true;
                this.scheduleOnce(function() {
                  this._offTime = 0;
                  this._clickState = false;
                  self.touchState = TOUCH_STATE.BLANK;
                  self.onTouchTile(tile);
                }, this.maxOffTime / 1e3);
              } else if (this.isLongTouch) {
                self.touchState = TOUCH_STATE.FLAG;
                self.onTouchTile(tile);
              }
              this._touchTime = 0;
            }, _this2);
            _this2.tilesLayout.addChild(tile);
            _this2.tiles.push(tile);
          };
          for (var x = 0; x < this.col; x++) _loop(x);
        }
        this.newGame();
        Linker.MySdk.showInterstitial();
      },
      update: function update(dt) {
        this._touchState && (this._touchTime = this._touchTime + 1e3 * dt);
        this._clickState && (this._offTime = this._offTime + 1e3 * dt);
      },
      clickCallBack: function clickCallBack(data) {
        console.log("click", data);
      },
      longTouchCallBack: function longTouchCallBack(data) {
        console.log("long press", data);
      },
      AdsDone: function AdsDone() {
        cc.error("QUANG CAO XONG ROI< CONG TIEN DI");
      },
      newGame: function newGame() {
        this.currentBomb = this.bombNum;
        Linker.MySdk.setDataActionAds({
          action: 1,
          script: this
        });
        this.timeCount = 0;
        this.isPlaying = true;
        for (var _n = 0; _n < this.tiles.length; _n++) {
          this.tiles[_n].getComponent("Tile").type = this.Tile.TYPE.ZERO;
          this.tiles[_n].getComponent("Tile").state = this.Tile.STATE.NONE;
        }
        var tilesIndex = [];
        for (var i = 0; i < this.tiles.length; i++) tilesIndex[i] = i;
        for (var j = 0; j < this.bombNum; j++) {
          var n = Math.floor(Math.random() * tilesIndex.length);
          this.tiles[tilesIndex[n]].getComponent("Tile").type = this.Tile.TYPE.BOMB_REVEALED;
          tilesIndex.splice(n, 1);
        }
        for (var k = 0; k < this.tiles.length; k++) {
          var tempBomb = 0;
          if (this.tiles[k].getComponent("Tile").type == this.Tile.TYPE.ZERO) {
            var roundTiles = this.tileRound(k);
            for (var m = 0; m < roundTiles.length; m++) roundTiles[m].getComponent("Tile").type == this.Tile.TYPE.BOMB_REVEALED && tempBomb++;
            this.tiles[k].getComponent("Tile").type = tempBomb;
          }
        }
        this.gameState = GAME_STATE.PLAY;
        this.black.active = false;
        this.countDownGamePlay(this.textTime);
        this.countTotalBombs(this.countBomb);
      },
      tileRound: function tileRound(i) {
        var roundTiles = [];
        i % this.col > 0 && roundTiles.push(this.tiles[i - 1]);
        i % this.col > 0 && Math.floor(i / this.col) > 0 && roundTiles.push(this.tiles[i - this.col - 1]);
        i % this.col > 0 && Math.floor(i / this.col) < this.row - 1 && roundTiles.push(this.tiles[i + this.col - 1]);
        Math.floor(i / this.col) > 0 && roundTiles.push(this.tiles[i - this.col]);
        Math.floor(i / this.col) < this.row - 1 && roundTiles.push(this.tiles[i + this.col]);
        i % this.col < this.col - 1 && roundTiles.push(this.tiles[i + 1]);
        i % this.col < this.col - 1 && Math.floor(i / this.col) > 0 && roundTiles.push(this.tiles[i - this.col + 1]);
        i % this.col < this.col - 1 && Math.floor(i / this.col) < this.row - 1 && roundTiles.push(this.tiles[i + this.col + 1]);
        return roundTiles;
      },
      onTouchTile: function onTouchTile(touchTile) {
        if (this.isPlaying) {
          if (this.gameState != GAME_STATE.PLAY) return;
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
                if (0 === testTile.getComponent("Tile").type) {
                  testTile.getComponent("Tile").state = this.Tile.STATE.CLICKED;
                  var roundTiles = this.tileRound(parseInt(testTile.name));
                  for (var i = 0; i < roundTiles.length; i++) roundTiles[i].getComponent("Tile").state == this.Tile.STATE.NONE && testTiles.push(roundTiles[i]);
                } else testTile.getComponent("Tile").type > 0 && testTile.getComponent("Tile").type < 4 && (testTile.getComponent("Tile").state = this.Tile.STATE.CLICKED);
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
          }
        }
      },
      judgeWin: function judgeWin() {
        var confNum = 0;
        for (var i = 0; i < this.tiles.length; i++) this.tiles[i].getComponent("Tile").state === this.Tile.STATE.CLICKED && confNum++;
        if (confNum === this.tiles.length - this.bombNum) {
          this.countDisposalBomb();
          this.gameState = GAME_STATE.WIN;
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
      gameOver: function gameOver() {
        console.log("mo tat ca bom");
        for (var i = 0; i < this.tiles.length; i++) this.tiles[i].getComponent("Tile").type === this.Tile.TYPE.BOMB_REVEALED && this.tiles[i].getComponent("Tile").state !== this.Tile.STATE.FLAG && (this.tiles[i].getComponent("Tile").state = this.Tile.STATE.CLICKED);
        this.gameState = GAME_STATE.DEAD;
        this.node.getComponent("AudioManagement").playEffectSound("fail", false);
        Linker.MySdk.setDataActionAds({
          action: 1,
          script: this
        });
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
      onBtnShow: function onBtnShow() {
        this.gameState === GAME_STATE.DEAD && this.newGame();
        if (this.gameState === GAME_STATE.WIN) {
          this.bombNum++;
          this.newGame();
        }
      },
      countDownGamePlay: function countDownGamePlay(lbCountUp) {
        var _this3 = this;
        var _this = this;
        this.timeGetVip = setInterval(function() {
          var day = Math.floor(_this3.timeCount / 864e5);
          var h = _this3.timeCount % 864e5;
          var hour = Math.floor(h / 36e5);
          var m = h % 36e5;
          var minutes = Math.floor(m / 6e4);
          var s = m % 6e4;
          var seconds = Math.floor(s / 1e3);
          lbCountUp.string = _this3.formatData(minutes) + ":" + _this3.formatData(seconds);
          _this3.timeCount += 1e3;
          _this.gameState !== GAME_STATE.DEAD && _this.gameState !== GAME_STATE.WIN || clearInterval(_this.timeGetVip);
        }, 1e3);
      },
      formatData: function formatData(time) {
        return time <= 0 ? "00" : time < 10 ? "0" + time : "" + time;
      },
      resetTime: function resetTime() {
        countDownGamePlay(0);
        this.timeGetVip && clearInterval(this.timeGetVip);
      },
      countTotalBombs: function countTotalBombs() {
        this.countBomb.string = this.bombNum.toString();
      },
      countBombFlag: function countBombFlag(touchTile) {
        var tileScript = touchTile.getComponent("Tile");
        if (tileScript) if (tileScript.state == this.Tile.STATE.FLAG) {
          var subBomb = --this.currentBomb;
          this.countBomb.string = subBomb.toString();
        } else if (tileScript.state == this.Tile.STATE.NONE) {
          var addBomb = ++this.currentBomb;
          this.countBomb.string = addBomb.toString();
        }
      },
      pauseGame: function pauseGame() {
        this.node.getComponent("AudioManagement").playEffectSound("click", false);
        this.black.active = true;
        this.btnPause.active = false;
        this.btnPlay.active = true;
        this.isPlaying = false;
        clearInterval(this.timeGetVip);
        var newPauseBack = cc.instantiate(this.pauseBack);
        var pb = newPauseBack.getComponent("popUp");
        pb && pb.show();
        this.node.addChild(newPauseBack);
      },
      resumeGame: function resumeGame() {
        this.node.getComponent("AudioManagement").playEffectSound("click", false);
        this.black.active = false;
        this.btnPlay.active = false;
        this.btnPause.active = true;
        this.countDownGamePlay(this.textTime);
        this.isPlaying = true;
      },
      countDisposalBomb: function countDisposalBomb() {
        var count = 0;
        for (var i = 0; i < this.tiles.length; i++) this.tiles[i].getComponent("Tile").type === this.Tile.TYPE.BOMB_REVEALED && this.tiles[i].getComponent("Tile").state === this.Tile.STATE.FLAG && count++;
        return count;
      },
      restartGame: function restartGame() {
        this.node.getComponent("AudioManagement").playEffectSound("click", false);
        this.btnPlay.active = false;
        this.btnPause.active = true;
        this.black.active = false;
      },
      restartGame2: function restartGame2() {
        this.node.getComponent("AudioManagement").playEffectSound("click", false);
        this.btnRestart.active = true;
        this.btnPlay.active = false;
        this.btnPause.active = false;
        this.black.active = false;
      },
      onBtnRestart: function onBtnRestart() {
        this.node.getComponent("AudioManagement").playEffectSound("click", false);
        this.newGame();
        this.btnPause.active = true;
        this.btnRestart.active = false;
        this.btnPlay.active = false;
        this.black.active = false;
      }
    });
    cc._RF.pop();
  }, {
    Linker: "Linker",
    Tile: "Tile"
  } ],
  Linker: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "673067BSZRCe78jKgT697WS", "Linker");
    "use strict";
    var Local = {};
    var Toast = require("Toast");
    var showMessage = function showMessage(text) {
      Toast(text, {});
    };
    var showMessageOption = function showMessageOption(text, option) {
      Toast(text, option);
    };
    module.exports = {
      Local: Local,
      DEBUG: false,
      isInitAdmod: false,
      isMySdkLoad: false,
      showMessage: showMessage,
      showMessageOption: showMessageOption
    };
    cc._RF.pop();
  }, {
    Toast: "Toast"
  } ],
  MySdk: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a2750//fllLbYSNqGyO8KBa", "MySdk");
    "use strict";
    var Linker = require("Linker");
    var SdkBoxUtil = require("SdkBoxUtil");
    cc.Class({
      extends: cc.Component,
      properties: {
        dataAds: null
      },
      start: function start() {},
      onLoad: function onLoad() {
        Linker.MySdk = this;
        if (cc.sys.isNative && "undefined" !== typeof sdkbox && !Linker.isInitAdmod) {
          Linker.isInitAdmod = true;
          this.initIAP();
          this.adMobInit();
          this.firebaseInit();
          SdkBoxUtil.initSDK();
        }
        Linker.isMySdkLoad || (Linker.isMySdkLoad = true);
      },
      otherSetting: function otherSetting() {
        cc.sys.isBrowser && this.completeCallback();
      },
      completeCallback: function completeCallback() {},
      get: function get(url, callback) {
        var xhr = new XMLHttpRequest();
        var that = this;
        xhr.addEventListener("error", function() {
          that.DialogReconnect.active = true;
        });
        xhr.onreadystatechange = function() {
          if (4 === xhr.readyState && xhr.status >= 200 && xhr.status < 400) {
            var response = xhr.responseText;
            callback && callback(JSON.parse(response));
          }
        };
        xhr.open("GET", url, true);
        xhr.send();
      },
      progressCallback: function progressCallback(completedCount, totalCount) {
        void 0 === totalCount && (totalCount = 1);
        this.progress = completedCount / totalCount;
        var precent = isNaN(Math.round(100 * this.progress)) ? "..." : Math.round(100 * this.progress);
        this.txtMessage && (this.txtMessage.string = "\u0110ang t\u1ea3i " + precent + "%");
      },
      updateCb: function updateCb(event) {
        var needRestart = false;
        var finish = false;
        console.log("update callback: " + event.getEventCode());
        switch (event.getEventCode()) {
         case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
          console.log("No local manifest file found, hot update skipped.");
          finish = true;
          break;

         case jsb.EventAssetsManager.UPDATE_PROGRESSION:
          this.progressCallback(event.getPercent());
          break;

         case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
         case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
          console.log("Fail to download manifest file, hot update skipped.");
          finish = true;
          break;

         case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
          console.log("Already up to date with the latest remote version.");
          finish = true;
          break;

         case jsb.EventAssetsManager.UPDATE_FINISHED:
          console.log("Update finished. " + event.getMessage());
          finish = true;
          needRestart = true;
          break;

         case jsb.EventAssetsManager.UPDATE_FAILED:
          console.log("Update failed. " + event.getMessage());
          this._failCount++;
          if (this._failCount < 5) this._am.downloadFailedAssets(); else {
            console.log("Reach maximum fail count, exit update process");
            this._failCount = 0;
            finish = true;
          }
          break;

         case jsb.EventAssetsManager.ERROR_UPDATING:
          console.log("Asset update error: " + event.getAssetId() + ", " + event.getMessage());
          break;

         case jsb.EventAssetsManager.ERROR_DECOMPRESS:
          console.log(event.getMessage());
        }
        if (finish) {
          this._am.setEventCallback(null);
          if (needRestart) {
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            Array.prototype.unshift.apply(searchPaths, newPaths);
            cc.sys.localStorage.setItem("HotUpdateSearchPaths", JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);
            if (cc.sys.os == cc.sys.OS_IOS) this.completeCallback(); else {
              cc.game.restart();
              this.completeCallback();
            }
          } else this.completeCallback();
        }
      },
      googleAnalyticInit: function googleAnalyticInit() {
        cc.sys.isNative && sdkbox.PluginGoogleAnalytics && sdkbox.PluginGoogleAnalytics.init();
      },
      firebaseInit: function firebaseInit() {
        cc.sys.isNative && sdkbox.firebase && sdkbox.firebase.Analytics && sdkbox.firebase.Analytics.init();
      },
      logEvent: function logEvent(event) {
        cc.sys.os != cc.sys.OS_ANDROID && cc.sys.os != cc.sys.OS_IOS || sdkbox.PluginGoogleAnalytics.logScreen(event);
      },
      chartBoostInit: function chartBoostInit() {
        cc.sys.isNative && sdkbox.PluginChartboost.init();
      },
      showChartBoostFull: function showChartBoostFull() {
        cc.sys.isNative && sdkbox.PluginChartboost.show("Default");
      },
      adMobInit: function adMobInit() {
        console.log("adMobInit");
        if (cc.sys.isNative) {
          var self = this;
          sdkbox.PluginAdMob.init();
          sdkbox.PluginAdMob.setListener({
            adViewDidReceiveAd: function adViewDidReceiveAd(name) {
              console.log("adViewDidReceiveAd  ");
            },
            adViewDidFailToReceiveAdWithError: function adViewDidFailToReceiveAdWithError(name, msg) {
              cc.sys.os == cc.sys.OS_ANDROID;
              cc.sys.os == cc.sys.OS_IOS;
            },
            adViewWillPresentScreen: function adViewWillPresentScreen(name) {
              console.log("adViewWillPresentScreen  " + name);
            },
            adViewDidDismissScreen: function adViewDidDismissScreen(name) {
              console.log("adViewDidDismissScreen:" + name);
              "gameover" == name && self.cacheInterstitial();
            },
            adViewWillDismissScreen: function adViewWillDismissScreen(name) {
              console.log("adViewWillDismissScreen:" + name);
            },
            adViewWillLeaveApplication: function adViewWillLeaveApplication(name) {
              console.log("adViewWillLeaveApplication  " + name);
            },
            reward: function(_reward) {
              function reward(_x, _x2, _x3) {
                return _reward.apply(this, arguments);
              }
              reward.toString = function() {
                return _reward.toString();
              };
              return reward;
            }(function(name, currency, amount) {
              console.log("reward name:" + reward);
              console.log("reward currency:" + currency);
              console.log("reward amount:" + amount);
              switch (this.dataAds.action) {
               case 1:
                console.log("CHAY XONG QUANG CAO 1");
                this.dataAds.script.AdsDone();
                break;

               case 2:
               case 3:
                cc.error();
              }
            })
          });
        }
      },
      setDataActionAds: function setDataActionAds(data) {
        this.dataAds = data;
      },
      test: function test() {
        switch (this.dataAds.action) {
         case 1:
          cc.error("CHAY XONG QUANG CAO 1");
          this.dataAds.script.AdsDone();
          break;

         case 2:
          cc.error("CHAY XONG QUANG CAO 2");
          break;

         case 3:
          cc.error();
        }
      },
      cacheInterstitial: function cacheInterstitial() {
        cc.sys.isNative && sdkbox.PluginAdMob.cache("interstitial");
      },
      showInterstitial: function showInterstitial() {
        console.log("showInterstitial");
        cc.sys.isNative && (sdkbox.PluginAdMob.isAvailable("interstitial") ? sdkbox.PluginAdMob.show("interstitial") : this.cacheInterstitial());
      },
      cacheBanner: function cacheBanner() {
        cc.sys.isNative && sdkbox.PluginAdMob.cache("banner");
      },
      showBanner: function showBanner() {
        console.log("showBanner:");
        if (cc.sys.isNative && "undefined" !== typeof sdkbox) if (sdkbox.PluginAdMob.isAvailable("banner")) sdkbox.PluginAdMob.show("banner"); else {
          console.log("cache showBanner");
          this.cacheBanner();
        }
      },
      showBannerHome: function showBannerHome() {
        console.log("showBannerHome:");
        if (cc.sys.isNative && "undefined" !== typeof sdkbox) if (sdkbox.PluginAdMob.isAvailable("bannerBottom")) sdkbox.PluginAdMob.show("bannerBottom"); else {
          console.log("cache home");
          sdkbox.PluginAdMob.cache("bannerBottom");
        }
      },
      bannerBottom: function bannerBottom() {
        console.log("BannerBottom");
        if (cc.sys.isNative && "undefined" !== typeof sdkbox) if (sdkbox.PluginAdMob.isAvailable("bannerBottom")) sdkbox.PluginAdMob.show("bannerBottom"); else {
          console.log("cache bannerBottom");
          sdkbox.PluginAdMob.cache("bannerBottom");
        }
      },
      hideBanner: function hideBanner() {
        cc.sys.isNative && sdkbox.PluginAdMob.hide("home");
      },
      cacheRewarded: function cacheRewarded() {
        cc.sys.isNative && sdkbox.PluginAdMob.cache("rewarded");
      },
      showRewarded: function showRewarded(id) {
        void 0 === id && (id = "");
        Linker.showMessage("Find ads....");
        console.log("showRewarded");
        if (cc.sys.isNative && "undefined" !== typeof sdkbox) if (id) {
          var rewardedid = "rewarded" + id;
          if (sdkbox.PluginAdMob.isAvailable(rewardedid)) sdkbox.PluginAdMob.show(rewardedid); else {
            console.log("cache rewarded");
            sdkbox.PluginAdMob.cache(rewardedid);
          }
        } else if (sdkbox.PluginAdMob.isAvailable("rewarded")) sdkbox.PluginAdMob.show("rewarded"); else {
          console.log("cache rewarded");
          sdkbox.PluginAdMob.cache("rewarded");
        }
      },
      cacheAllAds: function cacheAllAds() {
        this.cacheBanner();
        this.cacheInterstitial();
        this.cacheRewarded();
      },
      initOneSignal: function initOneSignal() {
        if (cc.sys.isNative) {
          sdkbox.PluginOneSignal.init();
          sdkbox.PluginOneSignal.setListener({
            onSendTag: function onSendTag(success, key, message) {},
            onGetTags: function onGetTags(jsonString) {},
            onIdsAvailable: function onIdsAvailable(userId, pushToken) {
              self.userId = userId;
              self.item2.setString(userId);
            },
            onPostNotification: function onPostNotification(success, message) {},
            onNotification: function onNotification(isActive, message, additionalData) {}
          });
          sdkbox.PluginOneSignal.setSubscription(true);
          sdkbox.PluginOneSignal.sendTag("packageName", PACKAGE_NAME);
          sdkbox.PluginOneSignal.enableInAppAlertNotification(true);
          sdkbox.PluginOneSignal.promptLocation();
        }
      },
      initIAP: function initIAP() {
        var self = this;
        if (cc.sys.isNative && "undefined" !== typeof sdkbox) {
          sdkbox.IAP.init();
          sdkbox.IAP.setDebug(true);
          sdkbox.IAP.setListener({
            onSuccess: function onSuccess(product) {
              self.iapListener(product.name);
            },
            onFailure: function onFailure(product, msg) {},
            onCanceled: function onCanceled(product) {},
            onRestored: function onRestored(product) {
              self.iapListener(product.name);
            },
            onRestoreComplete: function onRestoreComplete(ok, msg) {},
            onProductRequestSuccess: function onProductRequestSuccess(products) {
              for (var i = 0; i < products.length; i++) ;
            },
            onProductRequestFailure: function onProductRequestFailure(msg) {}
          });
        }
      },
      iap1: function iap1() {
        cc.sys.isMobile && sdkbox.IAP && sdkbox.IAP.purchase("iap1");
      },
      iap2: function iap2() {
        cc.sys.isMobile && sdkbox.IAP && sdkbox.IAP.purchase("iap2");
      },
      iap3: function iap3() {
        cc.sys.isMobile && sdkbox.IAP && sdkbox.IAP.purchase("iap3");
      },
      iapListener: function iapListener(name) {
        switch (name) {
         case "iap1":
          if (Linker.userData) {
            Linker.userData.userMoney += 16e3;
            Linker.HallView.updateUserMoney();
          }
          break;

         case "iap2":
          if (Linker.userData) {
            Linker.userData.userMoney += 2e4;
            Linker.HallView.updateUserMoney();
          }
          break;

         case "iap3":
          if (Linker.userData) {
            Linker.userData.userMoney += 31e3;
            Linker.HallView.updateUserMoney();
          }
        }
      }
    });
    cc._RF.pop();
  }, {
    Linker: "Linker",
    SdkBoxUtil: "SdkBoxUtil"
  } ],
  PluginSdkboxPlay: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4fd8dwVMCNMQ6mi6o9y6WLf", "PluginSdkboxPlay");
    "use strict";
    var SdkBoxUtil = require("SdkBoxUtil");
    var Linker = require("Linker");
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        Linker.PluginSdkboxPlay = this;
      },
      onEnable: function onEnable() {},
      onDisable: function onDisable() {},
      start: function start() {},
      showLeaderboard: function showLeaderboard() {
        console.log("showLeaderboard");
        if ("undefined" == typeof sdkbox) {
          console.log("sdkbox is not exist");
          return;
        }
        if ("undefined" != typeof sdkbox.PluginSdkboxPlay) {
          console.log("vao showLeaderboard");
          var plugin = sdkbox.PluginSdkboxPlay;
          plugin.isSignedIn() || SdkBoxUtil.googleLogin();
          plugin.showLeaderboard("ldb1");
        }
      },
      submitCore: function submitCore(money) {
        void 0 === money && (money = 1);
        console.log("sdkboxPlayInit");
        if ("undefined" == typeof sdkbox) {
          console.log("sdkbox is not exist");
          return;
        }
        if ("undefined" != typeof sdkbox.PluginSdkboxPlay) {
          console.log("ok send submitCore");
          sdkbox.PluginSdkboxPlay.submitScore("ldb1", money);
        }
      },
      btnShareFB: function btnShareFB() {
        Linker.showMessage("Share game....");
        if ("undefined" == typeof sdkbox) {
          console.log("sdkbox is not exist");
          return;
        }
        if (cc.sys.os == cc.sys.OS_ANDROID) {
          var str = "Ch\u01a1i TLMN Mi\u1ec5n Ph\xed: https://play.google.com/store/apps/details?id=com.zepplay.tienlenoffline";
          jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "shareData", "(Ljava/lang/String;)V", str);
        } else cc.sys.os == cc.sys.OS_IOS;
      }
    });
    cc._RF.pop();
  }, {
    Linker: "Linker",
    SdkBoxUtil: "SdkBoxUtil"
  } ],
  SdkBoxUtil: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4ac49YtHa5C9Z126ZGCUmsQ", "SdkBoxUtil");
    var Linker = require("Linker");
    module.exports = {
      initSDK: function() {
        console.log("initSDK");
        if ("undefined" == typeof sdkbox) {
          console.log("sdkbox is not exist");
          return;
        }
        this.sdkboxPlayInit();
        this.facebookInit();
      },
      sdkboxPlayInit: function() {
        console.log("sdkboxPlayInit");
        if ("undefined" == typeof sdkbox) {
          console.log("sdkbox is not exist");
          return;
        }
        if ("undefined" != typeof sdkbox.PluginSdkboxPlay) {
          var plugin = sdkbox.PluginSdkboxPlay;
          plugin.setListener({
            onConnectionStatusChanged: function(connection_status) {
              console.log("connection status change: " + connection_status + " connection_status");
              if (1e3 == connection_status) {
                console.log("Player id: " + plugin.getPlayerId());
                console.log("Player name: " + plugin.getPlayerAccountField("name"));
              } else console.log("Not connected. Status: " + connection_status);
            },
            onScoreSubmitted: function(leaderboard_name, score, maxScoreAllTime, maxScoreWeek, maxScoreToday) {
              console.log("onScoreSubmitted trigger leaderboard_name:" + leaderboard_name + " score:" + score + " maxScoreAllTime:" + maxScoreAllTime + " maxScoreWeek:" + maxScoreWeek + " maxScoreToday:" + maxScoreToday);
            },
            onMyScore: function(leaderboard_name, time_span, collection_type, score) {
              console.log("onMyScore trigger leaderboard_name:" + leaderboard_name + " time_span:" + time_span + " collection_type:" + collection_type + " score:" + score);
            },
            onMyScoreError: function(leaderboard_name, time_span, collection_type, error_code, error_description) {
              console.log("onMyScoreError trigger leaderboard_name:" + leaderboard_name + " time_span:" + time_span + " collection_type:" + collection_type + " error_code:" + error_code + " error_description:" + error_description);
            },
            onPlayerCenteredScores: function(leaderboard_name, time_span, collection_type, json_with_score_entries) {
              console.log("onPlayerCenteredScores trigger leaderboard_name:" + leaderboard_name + " time_span:" + time_span + " collection_type:" + collection_type + " json_with_score_entries:" + json_with_score_entries);
            },
            onPlayerCenteredScoresError: function(leaderboard_name, time_span, collection_type, error_code, error_description) {
              console.log("onPlayerCenteredScoresError trigger leaderboard_name:" + leaderboard_name + " time_span:" + time_span + " collection_type:" + collection_type + " error_code:" + error_code + " error_description:" + error_description);
            },
            onIncrementalAchievementUnlocked: function(achievement_name) {
              console.log("incremental achievement " + achievement_name + " unlocked.");
            },
            onIncrementalAchievementStep: function(achievement_name, step) {
              console.log("incremental achievent " + achievement_name + " step: " + step);
            },
            onIncrementalAchievementStepError: function(name, steps, error_code, error_description) {
              console.log("onIncrementalAchievementStepError trigger leaderboard_name:" + name + " steps:" + steps + " error_code:" + error_code + " error_description:" + error_description);
            },
            onAchievementUnlocked: function(achievement_name, newlyUnlocked) {
              console.log("onAchievementUnlocked trigger achievement_name:" + achievement_name + " newlyUnlocked:" + newlyUnlocked);
            },
            onAchievementUnlockError: function(achievement_name, error_code, error_description) {
              console.log("onAchievementUnlockError trigger achievement_name:" + achievement_name + " error_code:" + error_code + " error_description:" + error_description);
            },
            onAchievementsLoaded: function(reload_forced, json_achievements_info) {
              console.log("onAchievementsLoaded trigger reload_forced:" + reload_forced + " json_achievements_info:" + json_achievements_info);
            },
            onSetSteps: function(name, steps) {
              console.log("onSetSteps trigger name:" + name + " steps:" + steps);
            },
            onSetStepsError: function(name, steps, error_code, error_description) {
              console.log("onSetStepsError trigger name:" + name + " steps:" + steps + " error_code:" + error_code + " error_description:" + error_description);
            },
            onReveal: function(name) {
              console.log("onReveal trigger name:" + name);
            },
            onRevealError: function(name, error_code, error_description) {
              console.log("onRevealError trigger name:" + name + " error_code:" + error_code + " error_description:" + error_description);
            },
            onGameData: function(action, name, data, error) {
              error ? console.log("onGameData failed:" + error) : "load" == action ? console.log("onGameData load:" + name + ":" + data) : "save" == action ? console.log("onGameData save:" + name + ":" + data) : console.log("onGameData unknown action:" + action);
            }
          });
          plugin.init();
        } else printf("no plugin init");
      },
      googleLogin: function() {
        console.log("googleLogin");
        if ("undefined" == typeof sdkbox) {
          console.log("sdkbox is not exist");
          return;
        }
        if ("undefined" != typeof sdkbox.PluginSdkboxPlay) {
          var plugin = sdkbox.PluginSdkboxPlay;
          console.log("sdkbox isConnected", plugin.isConnected());
          if (plugin.isSignedIn()) {
            console.log("sdkbox isSignedIn");
            plugin.signout();
          } else {
            console.log("sdkbox signin");
            plugin.signin();
          }
          console.log("sdkbox getPlayerId", plugin.getPlayerId());
        }
      },
      loginFb: function() {
        console.log("loginFb");
        if ("undefined" !== typeof sdkbox) {
          if ("undefined" != typeof sdkbox.PluginSdkboxPlay) {
            console.log("vao dayloginFb:" + sdkbox.PluginFacebook.isLoggedIn());
            sdkbox.PluginFacebook.requestReadPermissions([ "public_profile", "email" ]);
            if (sdkbox.PluginFacebook.isLoggedIn()) {
              var token = sdkbox.PluginFacebook.getAccessToken();
              var userId = sdkbox.PluginFacebook.getUserID();
              var params = new Object();
              params["fields"] = "id,name,email,first_name,installed,last_name,picture{url}";
              sdkbox.PluginFacebook.api("/me", "GET", params, "/me");
            } else sdkbox.PluginFacebook.login();
          }
        } else console.log("sdkbox is not exist");
      },
      logoutFb: function() {
        "undefined" !== typeof sdkbox && sdkbox.PluginFacebook.logout();
        Linker.isFb = false;
      },
      onAPI: function(tag, data) {
        console.log("onAPI");
        console.log("tag:", tag);
        console.log("data:", data);
        console.log("data:", JSON.stringify(data));
        var token = "2134223423523534";
        var userId = 0xc3781fb4820;
        Linker.system.Event.DispatchEvent("token", {
          token: token,
          userId: userId,
          data: data
        });
      },
      submitCore: function(money) {
        void 0 === money && (money = 1);
        console.log("submitCore:" + money);
        if ("undefined" == typeof sdkbox) {
          console.log("sdkbox is not exist");
          return;
        }
        if ("undefined" != typeof sdkbox.PluginSdkboxPlay) {
          console.log("ok send submitCore");
          sdkbox.PluginSdkboxPlay.submitScore("ldb1", money);
        }
      },
      facebookInit: function() {
        console.log("facebookInit");
        if ("undefined" == typeof sdkbox) {
          console.log("sdkbox is not exist");
          return;
        }
        if ("undefined" != typeof sdkbox.PluginFacebook) {
          sdkbox.PluginFacebook.init();
          sdkbox.PluginFacebook.setListener({
            onLogin: function(isLogin, msg) {
              isLogin ? console.log("login successful") : console.log("login failed");
            },
            onAPI: function(tag, data) {
              console.log("onAPI:", data);
            },
            onSharedSuccess: function(data) {
              console.log("share successful");
            },
            onSharedFailed: function(data) {
              console.log("share failed");
            },
            onSharedCancel: function() {
              console.log("share canceled");
            },
            onPermission: function(isLogin, msg) {
              isLogin ? console.log("request permission successful") : console.log("request permission failed");
            },
            onFetchFriends: function(ok, msg) {},
            onRequestInvitableFriends: function(friendsData) {},
            onInviteFriendsWithInviteIdsResult: function(result, description) {},
            onInviteFriendsResult: function(result, description) {}
          });
        }
      }
    };
    cc._RF.pop();
  }, {
    Linker: "Linker"
  } ],
  Tile: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fba08qgaqxB3KSem6f6Yxj7", "Tile");
    "use strict";
    var TYPE = cc.Enum({
      ZERO: 0,
      ONE: 1,
      TWO: 2,
      THREE: 3,
      BOMB_DEATH: 4,
      BOMB_REVEALED: 5
    });
    var STATE = cc.Enum({
      NONE: -1,
      CLICKED: -1,
      FLAG: -1,
      DOUBT: -1
    });
    module.exports = {
      STATE: STATE,
      TYPE: TYPE
    };
    cc.Class({
      extends: cc.Component,
      properties: {
        picNone: cc.SpriteFrame,
        picFlag: cc.SpriteFrame,
        picDoubt: cc.SpriteFrame,
        picZero: cc.SpriteFrame,
        picOne: cc.SpriteFrame,
        picTwo: cc.SpriteFrame,
        picThree: cc.SpriteFrame,
        picBombDeath: cc.SpriteFrame,
        PicBombRevealed: cc.SpriteFrame,
        _state: {
          default: STATE.NONE,
          type: STATE,
          visible: false
        },
        state: {
          get: function get() {
            return this._state;
          },
          set: function set(value) {
            if (value !== this._state) {
              this._state = value;
              switch (this._state) {
               case STATE.CLICKED:
                this.showType();
                break;

               case STATE.NONE:
                this.getComponent(cc.Sprite).spriteFrame = this.picNone;
                break;

               case STATE.FLAG:
                this.getComponent(cc.Sprite).spriteFrame = this.picFlag;
                break;

               case STATE.DOUBT:
                this.getComponent(cc.Sprite).spriteFrame = this.picDoubt;
              }
            }
          },
          type: STATE
        },
        type: {
          default: TYPE.ZERO,
          type: TYPE
        }
      },
      showType: function showType() {
        switch (this.type) {
         case TYPE.ZERO:
          this.getComponent(cc.Sprite).spriteFrame = this.picZero;
          break;

         case TYPE.ONE:
          this.getComponent(cc.Sprite).spriteFrame = this.picOne;
          break;

         case TYPE.TWO:
          this.getComponent(cc.Sprite).spriteFrame = this.picTwo;
          break;

         case TYPE.THREE:
          this.getComponent(cc.Sprite).spriteFrame = this.picThree;
          break;

         case TYPE.BOMB_DEATH:
          this.getComponent(cc.Sprite).spriteFrame = this.picBombDeath;
          break;

         case TYPE.BOMB_REVEALED:
          this.getComponent(cc.Sprite).spriteFrame = this.PicBombRevealed;
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  Toast: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e6dc3umW1xOBqtDPejXqKwp", "Toast");
    "use strict";
    function Toast(text, _temp) {
      void 0 === text && (text = "");
      var _ref = void 0 === _temp ? {} : _temp, _ref$gravity = _ref.gravity, gravity = void 0 === _ref$gravity ? "BOTTOM" : _ref$gravity, _ref$duration = _ref.duration, duration = void 0 === _ref$duration ? 2 : _ref$duration, _ref$bg_color = _ref.bg_color, bg_color = void 0 === _ref$bg_color ? cc.color(102, 102, 102, 200) : _ref$bg_color;
      var canvas = cc.director.getScene().getComponentInChildren(cc.Canvas);
      var width = canvas.node.width;
      var height = canvas.node.height;
      var bgNode = new cc.Node();
      var textNode = new cc.Node();
      var textLabel = textNode.addComponent(cc.Label);
      textLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
      textLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;
      textLabel.fontSize = 22;
      textLabel.string = text;
      if (text.length * textLabel.fontSize > 4 * width / 5) {
        textNode.width = 4 * width / 5;
        textLabel.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
      } else textNode.width = text.length * textLabel.fontSize;
      var lineCount = 1 + ~~(text.length * textLabel.fontSize / (3 * width / 5));
      textNode.height = textLabel.fontSize * lineCount;
      var ctx = bgNode.addComponent(cc.Graphics);
      ctx.arc(-textNode.width / 2, 0, textNode.height / 2 + 20, .5 * Math.PI, 1.5 * Math.PI, true);
      ctx.lineTo(textNode.width / 2, -(textNode.height / 2 + 20));
      ctx.arc(textNode.width / 2, 0, textNode.height / 2 + 20, 1.5 * Math.PI, .5 * Math.PI, true);
      ctx.lineTo(-textNode.width / 2, textNode.height / 2 + 20);
      ctx.fillColor = bg_color;
      ctx.fill();
      bgNode.addChild(textNode);
      if ("CENTER" === gravity) {
        bgNode.y = 0;
        bgNode.x = 0;
      } else "TOP" === gravity ? bgNode.y = bgNode.y + height / 5 * 2 : "BOTTOM" === gravity && (bgNode.y = bgNode.y - height / 5 * 2);
      canvas.node.addChild(bgNode);
      var finished = cc.callFunc(function() {
        bgNode.destroy();
      });
      var action = cc.sequence(cc.moveBy(duration, cc.v2(0, 0)), cc.fadeOut(.3), finished);
      bgNode.runAction(action);
    }
    module.exports = Toast;
    cc._RF.pop();
  }, {} ],
  circularScroll: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1a271sH8jxGpKgHWO79+g6R", "circularScroll");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        revolveTime: .8,
        point_blue: cc.Node,
        point_green: cc.Node,
        point_yellow: cc.Node
      },
      onLoad: function onLoad() {
        var getIdMap = JSON.parse(cc.sys.localStorage.getItem("mapId"));
        this.attrArray = [ JSON.stringify({
          zIndex: 3,
          scale: 1,
          opacity: 255,
          pos: this.node.children[0].position
        }), JSON.stringify({
          zIndex: 2,
          scale: .3,
          opacity: 255,
          pos: this.node.children[1].position
        }), JSON.stringify({
          zIndex: 1.9,
          scale: .3,
          opacity: 255,
          pos: this.node.children[2].position
        }) ];
        this.cardsArray = this.node.children;
        for (var i = 0; i < this.cardsArray.length; i++) {
          this.cardsArray[i].num = i;
          var initAttr = JSON.parse(this.attrArray[i]);
          this.cardsArray[i].zIndex = initAttr["zIndex"];
          this.cardsArray[i].scale = initAttr["scale"];
          this.cardsArray[i].opacity = initAttr["opacity"];
          this.cardsArray[i].pos = initAttr["pos"];
        }
        this.node.on("touchmove", this.onTouchMove, this);
        this.point_green.getChildByName("indicator1").active = false;
        this.point_blue.getChildByName("indicator2").active = true;
        this.point_yellow.getChildByName("indicator3").active = false;
        if (2 == getIdMap) {
          this.onTouchMove2(null, -50);
          this.point_green.getChildByName("indicator1").active = false;
          this.point_blue.getChildByName("indicator2").active = false;
          this.point_yellow.getChildByName("indicator3").active = true;
        } else if (3 == getIdMap) {
          this.onTouchMove2(null, 50);
          this.point_green.getChildByName("indicator1").active = true;
          this.point_blue.getChildByName("indicator2").active = false;
          this.point_yellow.getChildByName("indicator3").active = false;
        }
      },
      onTouchMove: function onTouchMove(event) {
        for (var i = 0; i < this.cardsArray.length; i++) if (this.cardsArray[i].getActionByTag(1)) return;
        var deltaX = event.getDelta().x;
        deltaX > this.node.parent.width / 40 ? this.revolve2Right(this.revolveTime) : deltaX < -this.node.parent.width / 40 && this.revolve2Left(this.revolveTime);
      },
      onTouchMove2: function onTouchMove2(event, deltaX) {
        for (var i = 0; i < this.cardsArray.length; i++) if (this.cardsArray[i].getActionByTag(1)) return;
        deltaX > this.node.parent.width / 40 ? this.revolve2Right(0) : deltaX < -this.node.parent.width / 40 && this.revolve2Left(0);
      },
      revolve2Right: function revolve2Right(revolveTime) {
        for (var i = 0; i < this.cardsArray.length; i++) {
          this.cardsArray[i].num < this.cardsArray.length - 1 ? this.cardsArray[i].num += 1 : this.cardsArray[i].num = 0;
          var nextAttr = JSON.parse(this.attrArray[this.cardsArray[i].num]);
          this.cardsArray[i].zIndex = nextAttr["zIndex"];
          var scaleAction = cc.scaleTo(revolveTime, nextAttr["scale"]);
          var fadeAction = cc.fadeTo(revolveTime, nextAttr["opacity"]);
          var moveAction = cc.moveTo(revolveTime, nextAttr["pos"]);
          var spawnAction = cc.spawn(scaleAction, fadeAction, moveAction);
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
          }
        }
      },
      revolve2Left: function revolve2Left(revolveTime) {
        for (var i = 0; i < this.cardsArray.length; i++) {
          this.cardsArray[i].num > 0 ? this.cardsArray[i].num -= 1 : this.cardsArray[i].num = this.cardsArray.length - 1;
          var nextAttr = JSON.parse(this.attrArray[this.cardsArray[i].num]);
          this.cardsArray[i].zIndex = nextAttr["zIndex"];
          var scaleAction = cc.scaleTo(revolveTime, nextAttr["scale"]);
          var fadeAction = cc.fadeTo(revolveTime, nextAttr["opacity"]);
          var moveAction = cc.moveTo(revolveTime, nextAttr["pos"]);
          var spawnAction = cc.spawn(scaleAction, fadeAction, moveAction);
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
          }
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  endGame: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "136d8EyBnBEibGv5EvHQZ0u", "endGame");
    "use strict";
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
        btnResume: cc.Node
      },
      onLoad: function onLoad() {},
      AdsDone: function AdsDone() {
        cc.error("QUANG CAO O BUTTON TIEP TUC XONG ROI< CONG TIEN DI");
      },
      showWin: function showWin() {
        this.result.string = "VICTORY!";
        this.aniVictory.active = true;
      },
      showFail: function showFail() {
        this.result.string = "FAIL...";
        this.aniFail.active = true;
      },
      onBtnStart: function onBtnStart() {
        this.node.getComponent("AudioManagement").playEffectSound("click", false);
        var b = this.getComponent("popUp");
        b.hide();
        var a = this.node.parent.getComponent("Game");
        a.newGame();
      },
      onBtnClose: function onBtnClose() {
        this.node.getComponent("AudioManagement").playEffectSound("click", false);
        var b2 = this.getComponent("popUp");
        b2.hide();
        var a2 = this.node.parent.getComponent("Game");
        a2.restartGame2();
      },
      setTimeEnd: function setTimeEnd(timeEnd) {
        var day = Math.floor(timeEnd / 864e5);
        var h = timeEnd % 864e5;
        var hour = Math.floor(h / 36e5);
        var m = h % 36e5;
        var minutes = Math.floor(m / 6e4);
        var s = m % 6e4;
        var seconds = Math.floor(s / 1e3);
        timeEnd = this.formatData(minutes) + ":" + this.formatData(seconds);
        this.txtTimeEnd.string = timeEnd;
      },
      formatData: function formatData(time) {
        return time <= 0 ? "00" : time < 10 ? "0" + time : "" + time;
      },
      getBomb: function getBomb(bomb) {
        this.txtBomb.string = bomb;
      },
      disposalBomb: function disposalBomb() {
        this.txtDisposal.string = this.node.parent.getComponent("Game").countDisposalBomb();
      },
      setLevel: function setLevel() {
        18 == this.txtBomb.string && (this.txtLevel.string = "Normal");
        12 == this.txtBomb.string && (this.txtLevel.string = "Easy");
        24 == this.txtBomb.string && (this.txtLevel.string = "Hard");
      },
      onBtnResume: function onBtnResume() {
        this.node.getComponent("AudioManagement").playEffectSound("click", false);
        Linker.MySdk.setDataActionAds({
          action: 1,
          script: this
        });
        Linker.MySdk.showInterstitial();
        var b3 = this.getComponent("popUp");
        b3.hide();
        var a2 = this.getComponent("loadScene");
        var a3 = this.node.parent.getComponent("Game");
        "Easy" == this.txtLevel.string && a2.loadMapLua();
        "Normal" == this.txtLevel.string && a2.loadMapBang();
        "Hard" == this.txtLevel.string && a3.onBtnShow();
      }
    });
    cc._RF.pop();
  }, {
    Linker: "Linker"
  } ],
  itemMoreGameControler: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "36d32KON7FFG78VoMdU5XgA", "itemMoreGameControler");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        avatar: cc.Sprite,
        txt_name: cc.Label,
        listAvatarGame: cc.SpriteAtlas
      },
      start: function start() {},
      showData: function showData(data) {
        this.data = data;
        this.txt_name.string = data.name.vi;
        var sprite = this.listAvatarGame.getSpriteFrame(data.avatar.split(".")[0]);
        sprite && (this.avatar.spriteFrame = sprite);
      },
      btnDownOnClick: function btnDownOnClick() {
        console.log(this.data.url);
        cc.sys.openURL(this.data.url);
      }
    });
    cc._RF.pop();
  }, {} ],
  loadScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4b207K7aHlJsIbPOs3COQbo", "loadScene");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      loadLobby: function loadLobby() {
        this.ClickSound();
        cc.director.loadScene("Lobby");
      },
      loadMapBang: function loadMapBang() {
        this.ClickSound();
        cc.director.loadScene("mapBang");
        cc.sys.localStorage.setItem("mapId", JSON.stringify(1));
      },
      loadMapLua: function loadMapLua() {
        this.ClickSound();
        cc.director.loadScene("mapLua");
        cc.sys.localStorage.setItem("mapId", JSON.stringify(2));
      },
      loadMapRung: function loadMapRung() {
        this.ClickSound();
        cc.director.loadScene("mapRung");
        cc.sys.localStorage.setItem("mapId", JSON.stringify(3));
      },
      loadHome: function loadHome() {
        this.ClickSound();
        cc.director.loadScene("Home");
      },
      ClickSound: function ClickSound() {
        var audioScript = cc.find("/Canvas").getComponent("AudioManagement");
        audioScript && audioScript.playEffectSound("clickMap", false);
      }
    });
    cc._RF.pop();
  }, {} ],
  loadingBar: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "06b5a9bb1BJl6HVXD9GQdI0", "loadingBar");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        loadingLabel: cc.Label,
        progressSprite: cc.Sprite
      },
      onLoad: function onLoad() {
        cc.director.preloadScene("Home", function(complete, total, item) {
          var per = complete / total;
          this.progressSprite.fillStart = 0;
          this.progressSprite.fillRange = per;
          this.loadingLabel.string = "Loading " + Math.floor(100 * per) + "%";
        }.bind(this), function(err, ass) {
          err || cc.director.loadScene("Home");
        });
      }
    });
    cc._RF.pop();
  }, {} ],
  moreGameCtrl: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "019baC68hBN2a0tHXBFWnum", "moreGameCtrl");
    "use strict";
    var users = [];
    cc.Class({
      extends: cc.Component,
      properties: {
        itemGame: cc.Prefab,
        content: cc.Node,
        listGameBackup: cc.JsonAsset
      },
      onEnable: function onEnable() {
        this.showListGame();
      },
      showListGame: function showListGame() {
        this.content.removeAllChildren();
        var listGame = this.listGameBackup.json.listGame;
        for (var i = 0; i < listGame.length; i++) {
          var newItemGame = cc.instantiate(this.itemGame);
          if (newItemGame) {
            var itemScript = newItemGame.getComponent("itemMoreGameControler");
            itemScript.showData(listGame[i]);
            this.content.addChild(newItemGame);
          }
        }
        console.log(this.content);
      }
    });
    cc._RF.pop();
  }, {} ],
  pauseBack: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f6ea4+rew5FjqIjvhgPH8sp", "pauseBack");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        btnResume: cc.Node,
        btnRestart: cc.Node,
        btnBack: cc.Node,
        btnSoundOn: cc.Node,
        btnSoundOff: cc.Node
      },
      onLoad: function onLoad() {
        var soundData = JSON.parse(cc.sys.localStorage.getItem("soundOff"));
        if (false == soundData) {
          this.btnSoundOn.active = false;
          this.btnSoundOff.active = true;
        } else {
          this.btnSoundOn.active = true;
          this.btnSoundOff.active = false;
        }
      },
      onBtnResume: function onBtnResume() {
        var r = this.node.parent.getComponent("Game");
        r.resumeGame();
        var r2 = this.getComponent("popUp");
        r2.hide();
      },
      onBtnRestart: function onBtnRestart() {
        var a2 = this.getComponent("popUp");
        a2.hide();
        var a = this.node.parent.getComponent("Game");
        a.newGame();
        a.restartGame();
      },
      onBtnBack: function onBtnBack() {
        var b2 = this.getComponent("loadScene");
        b2.loadLobby();
        var b = this.getComponent("popUp");
        b.hide();
      },
      onBtnSoundOn: function onBtnSoundOn() {
        this.btnSoundOn.active = false;
        this.btnSoundOff.active = true;
        var canvas = cc.find("/Canvas").getComponent("AudioManagement");
        canvas._isPlaying = false;
        cc.sys.localStorage.setItem("soundOff", JSON.stringify(false));
      },
      onBtnSoundOff: function onBtnSoundOff() {
        this.btnSoundOn.active = true;
        this.btnSoundOff.active = false;
        var canvas = cc.find("/Canvas").getComponent("AudioManagement");
        canvas._isPlaying = true;
        cc.sys.localStorage.setItem("soundOff", JSON.stringify(true));
      },
      ClickSound: function ClickSound() {
        var audioScript = cc.find("/Canvas").getComponent("AudioManagement");
        audioScript && audioScript.playEffectSound("click", false);
      }
    });
    cc._RF.pop();
  }, {} ],
  popUp: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c4578WUefZIDZ2HtDV2QtLH", "popUp");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        facebookConnect: ""
      },
      show: function show() {
        this.node.active = true;
        this.node.opacity = 0;
        this.node.scale = .2;
        cc.tween(this.node).to(.5, {
          scale: 1,
          opacity: 255
        }, {
          easing: "backInOut"
        }).start();
      },
      hide: function hide() {
        var _this = this;
        cc.tween(this.node).to(.5, {
          scale: .2,
          opacity: 0
        }, {
          easing: "backInOut"
        }).call(function() {
          _this.node.active = false;
        }).start();
      },
      faceBook_connect: function faceBook_connect() {
        cc.sys.isBrowser && cc.sys.openURL(this.facebookConnect);
      },
      feedBack: function feedBack() {},
      ClickSoundPopUp: function ClickSoundPopUp() {
        var audioScript = cc.find("/Canvas").getComponent("AudioManagement");
        audioScript && audioScript.playEffectSound("popUp", false);
      },
      clickSound: function clickSound() {
        var audioScript = cc.find("/Canvas").getComponent("AudioManagement");
        audioScript && audioScript.playEffectSound("click", false);
      }
    });
    cc._RF.pop();
  }, {} ],
  singlePatternMoney: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "10fb02ZWIBMnLelNQ5H1AS9", "singlePatternMoney");
    "use strict";
    exports.__esModule = true;
    exports.singlePatternMoney = void 0;
    var singlePatternMoney = function() {
      var instance;
      function init() {
        var money = 0;
        return {
          setMoney: function setMoney(x) {
            money = x;
          },
          getMoney: function getMoney() {
            return money;
          }
        };
      }
      return {
        getInstance: function getInstance() {
          instance || (instance = init());
          return instance;
        }
      };
    }();
    exports.singlePatternMoney = singlePatternMoney;
    cc._RF.pop();
  }, {} ]
}, {}, [ "AudioManagement", "circularScroll", "Game", "Tile", "Constant", "Linker", "MySdk", "PluginSdkboxPlay", "SdkBoxUtil", "Toast", "singlePatternMoney", "loadScene", "loadingBar", "itemMoreGameControler", "moreGameCtrl", "endGame", "pauseBack", "popUp" ]);
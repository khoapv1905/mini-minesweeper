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
  Utils: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "24e92mSa7NA4ZRQlX1/Ey88", "Utils");
    "use strict";
    var Utils = {
      isJsonString: function isJsonString(str) {
        try {
          JSON.parse(str);
        } catch (e) {
          return false;
        }
        return true;
      }
    };
    module.exports = Utils;
    cc._RF.pop();
  }, {} ],
  functionAll: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3751bhy8xVLkKEr+GLHjK4U", "functionAll");
    "use strict";
    var Utils = require("Utils");
    var timeWaitQC = 18e5;
    cc.Class({
      extends: cc.Component,
      ctor: function ctor() {
        this.coinsMode = null;
      },
      properties: {},
      onLoad: function onLoad() {
        this.left = true;
        var tableGame2 = this.getData("tableGame2");
        if (tableGame2) {
          this.total = tableGame2.computer3.total;
          this.win = tableGame2.computer3.win;
        } else {
          this.total = 0;
          this.win = 0;
        }
      },
      onEnable: function onEnable() {
        this.Money = this.getData("tableGame2").computer3.Money;
      },
      onDisable: function onDisable() {},
      addTotal: function addTotal(bool) {
        bool && ++this.total;
      },
      getTotal: function getTotal() {
        return this.total;
      },
      isWin: function isWin(bool) {
        bool && ++this.win;
      },
      getWin: function getWin() {
        return this.win;
      },
      setMoney: function setMoney(money) {
        this.Money = money;
        var tableGame2 = this.getData("tableGame2");
        tableGame2.computer3.Money = this.Money;
        this.callSubmitCore();
        this.setData("tableGame2", tableGame2);
      },
      getMoney: function getMoney() {
        return this.Money;
      },
      start: function start() {},
      setData: function setData(key, value) {
        "tableGame2" == key && "undefined" != typeof sdkbox && (this.moneyCurrent = value.computer3.Money);
        cc.sys.localStorage.setItem([ key ], JSON.stringify(value));
      },
      getData: function getData(key) {
        var checkData = Utils.isJsonString(cc.sys.localStorage.getItem([ key ]));
        var datas = checkData ? cc.sys.localStorage.getItem([ key ]) : "{}";
        return JSON.parse(datas);
      },
      removeData: function removeData(key) {
        cc.sys.localStorage.removeItem(key);
      },
      createTable: function createTable() {
        var tableGame1 = this.getData("tableGame");
        if (tableGame1) return tableGame1;
        this.setData("tableGame", tableGame);
        return tableGame;
      },
      createTable2: function createTable2() {
        var tableGame2 = this.getData("tableGame2");
        if (tableGame2) return tableGame2;
        this.setData("tableGame2", tableGame);
        return tableGame;
      },
      createTable3: function createTable3() {
        var tableGame3 = this.getData("tableGame3");
        if (tableGame3) return tableGame3;
        this.setData("tableGame3", tableGame);
        return tableGame;
      },
      createSettingData: function createSettingData() {
        var setting1 = this.getData("setting");
        if (setting1) return setting1;
        this.setData("setting", setting);
        this.setData("scoreMode", false);
        this.setData("coinsMode", false);
        this.setData("demLaMode", false);
        this.setData("nhatAnTatMode", false);
        return setting;
      },
      createDailyGift: function createDailyGift() {
        var dailyGift1 = this.getData("dailyGift");
        if (dailyGift1) return dailyGift1;
        var cur = new Date().toString().split(" ");
        cur[4] = "00:00:00";
        cur = cur.join(" ");
        dailyGift.today = new Date(cur).getTime() + 864e5;
        dailyGift.consecutiveLogin.date = new Date(cur).getTime();
        dailyGift.get.time = Date.now();
        this.setData("dailyGift", dailyGift);
        return dailyGift;
      },
      createReport: function createReport() {
        var report = {
          thang: 0,
          thua: 0,
          chatHeo: 0,
          toiTrang: 0,
          dutBaBich: 0
        };
        this.setData("report", report);
        return report;
      },
      setReport: function setReport(type) {
        var report = this.getData("report");
        report[type] += 1;
        this.setData("report", report);
      },
      getByName: function getByName(obj, Name, coinsMode) {
        null != coinsMode && (this.coinsMode = coinsMode);
        var tableGame = "tableGame2";
        "CoinsMode" == this.coinsMode ? tableGame = "tableGame2" : "DemLaMode" == this.coinsMode ? tableGame = "tableGame2" : "NhatAnTatMode" == this.coinsMode && (tableGame = "tableGame2");
        var objName = this.getData(tableGame)[Name];
        if (!objName) return;
        if ("table" == Name) {
          obj.winMember = objName.winMember;
          obj.boLuotMember = objName.boLuotMember;
          obj.betting = objName.betting;
          obj.winRank = objName.winRank;
          obj.turn = objName.turn;
          obj.firstTurn = objName.firstTurn;
          obj.lastCard = objName.lastCard;
          obj.lastCardOld = objName.lastCardOld;
          obj.lstnextTurn = objName.lstnextTurn;
          obj.anHang = objName.anHang;
          obj.level = this.getData("setting").level;
        } else {
          obj.playerName = objName.playerName;
          obj.Money = objName.Money;
          obj.Point = objName.Point;
          obj.listCard = objName.listCard;
          obj.isBoLuot = objName.isBoLuot;
          obj.isWin = objName.isWin;
          obj.isTurn = objName.isTurn;
          obj.isRank = objName.isRank;
          obj.urlAvatar = "computer3" == Name ? this.getData("setting").avatar : objName.urlAvatar;
        }
      },
      SaveDataAll: function SaveDataAll(table, computer0, computer1, computer2, computer3, coinsMode) {
        tableGame.table.turn = table.turn;
        tableGame.table.firstTurn = table.firstTurn;
        tableGame.table.lastCard = table.lastCard;
        tableGame.table.lastCardOld = table.lastCardOld;
        tableGame.table.winRank = table.winRank;
        tableGame.table.winMember = table.winMember;
        tableGame.table.boLuotMember = table.boLuotMember;
        tableGame.table.betting = table.betting;
        tableGame.table.lstnextTurn = table.lstnextTurn;
        tableGame.table.anHang = table.anHang;
        tableGame.computer0.playerName = computer0.playerName;
        tableGame.computer0.urlAvatar = computer0.urlAvatar;
        tableGame.computer0.Money = computer0.Money;
        tableGame.computer0.Point = computer0.Point;
        tableGame.computer0.listCard = computer0.listCard;
        tableGame.computer0.isBoLuot = computer0.isBoLuot;
        tableGame.computer0.isWin = computer0.isWin;
        tableGame.computer0.isTurn = computer0.isTurn;
        tableGame.computer0.isRank = computer0.isRank;
        tableGame.computer1.playerName = computer1.playerName;
        tableGame.computer1.urlAvatar = computer1.urlAvatar;
        tableGame.computer1.Money = computer1.Money;
        tableGame.computer1.Point = computer1.Point;
        tableGame.computer1.listCard = computer1.listCard;
        tableGame.computer1.isBoLuot = computer1.isBoLuot;
        tableGame.computer1.isWin = computer1.isWin;
        tableGame.computer1.isTurn = computer1.isTurn;
        tableGame.computer1.isRank = computer1.isRank;
        tableGame.computer2.playerName = computer2.playerName;
        tableGame.computer2.urlAvatar = computer2.urlAvatar;
        tableGame.computer2.Money = computer2.Money;
        tableGame.computer2.Point = computer2.Point;
        tableGame.computer2.listCard = computer2.listCard;
        tableGame.computer2.isBoLuot = computer2.isBoLuot;
        tableGame.computer2.isWin = computer2.isWin;
        tableGame.computer2.isTurn = computer2.isTurn;
        tableGame.computer2.isRank = computer2.isRank;
        tableGame.computer3.playerName = computer3.playerName;
        tableGame.computer3.urlAvatar = computer3.urlAvatar;
        tableGame.computer3.Money = computer3.Money;
        tableGame.computer3.Point = computer3.Point;
        tableGame.computer3.listCard = computer3.listCard;
        tableGame.computer3.isBoLuot = computer3.isBoLuot;
        tableGame.computer3.isWin = computer3.isWin;
        tableGame.computer3.isTurn = computer3.isTurn;
        tableGame.computer3.isRank = computer3.isRank;
        "CoinsMode" == coinsMode ? this.setData("tableGame2", tableGame) : "ScoreMode" == coinsMode ? this.setData("tableGame2", tableGame) : "DemLaMode" == coinsMode ? this.setData("tableGame3", tableGame) : "NhatAnTatMode" == coinsMode && this.setData("tableGame2", tableGame);
      },
      updateSetting: function updateSetting(setting) {
        this.setData("setting", setting);
      },
      moneyWithFormat: function moneyWithFormat(money, formatter) {
        if (!money) return "";
        return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, formatter);
      },
      callSubmitCore: function callSubmitCore() {
        var node = cc.find("Canvas/_Home");
        node || (node = cc.find("Canvas/_GameController"));
        if (node && cc.isValid(node)) {
          var pluginSdkboxPlay = node.getComponent("PluginSdkboxPlay");
          pluginSdkboxPlay && pluginSdkboxPlay.submitCore(this.moneyCurrent);
        }
      }
    });
    cc._RF.pop();
  }, {
    Utils: "Utils"
  } ]
}, {}, [ "functionAll", "Utils" ]);
// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Local = {
  


}
var Toast = require('Toast');
var showMessage = function (text) {
    Toast(text, {});
}
var showMessageOption = function (text,option) {
    Toast(text, option);
}

module.exports = {
    Local: Local,
    DEBUG: false,
    isInitAdmod: false,
    isMySdkLoad: false,
    showMessage: showMessage,
    showMessageOption: showMessageOption,
   
    
};

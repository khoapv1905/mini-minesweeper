var users = [];
cc.Class({
    extends: cc.Component,


    properties: {
        itemGame: cc.Prefab,
        content: cc.Node,
        listGameBackup: cc.JsonAsset,
    },
    onEnable() {
        this.showListGame();
        
    },
    showListGame() {
        this.content.removeAllChildren();
        // lay data tu API
        // ===> list data
        var listGame = this.listGameBackup.json.listGame;
        // cc.assetManager.loadRemote("", function(err, data) {
        //     console.log(data);
        //     //debugger
        // });
        for (var i = 0; i < listGame.length; i++) {
            var newItemGame = cc.instantiate(this.itemGame);
            if (newItemGame) {
                //item call script cuar chinhs item day (dataItem)
                var itemScript = newItemGame.getComponent("itemMoreGameControler");
                itemScript.showData(listGame[i]);
                this.content.addChild(newItemGame);
            }
        }
        console.log(this.content);


    },
});
var Linker = require('Linker');
// var functionAll = require('functionAll');
var SdkBoxUtil = require('SdkBoxUtil');
cc.Class({
    extends: cc.Component,

    properties: {
        // func: functionAll,
        // manifestUrl: {
        //     type: cc.Asset,
        //     default: null,
        // },
        dataAds: null
    },

    // LIFE-CYCLE CALLBACKS:

    start() {


    },
    onLoad: function () {
        Linker.MySdk = this;
        if (cc.sys.isNative && typeof sdkbox !== "undefined") {
            if (!Linker.isInitAdmod) {
                Linker.isInitAdmod = true;
                this.initIAP();
                this.adMobInit();
                this.firebaseInit();
                SdkBoxUtil.initSDK();
            }
        }
        if (!Linker.isMySdkLoad) {
            Linker.isMySdkLoad = true;
            // this.otherSetting(); //add by zep
        }


    },
    otherSetting() { //start add by zep 
        if (cc.sys.isBrowser) {
            this.completeCallback();
            //cc.loader.loadResDir("", this.progressCallback.bind(this), this.completeCallback.bind(this));
        } else {
            //this.prepareUpdate(); //TODO hotupdate
            // this.completeCallback();
        }
    },
    completeCallback: function () {

    },
    get(url, callback) {
        var xhr = new XMLHttpRequest();
        var that = this;
        xhr.addEventListener('error', function () {
            that.DialogReconnect.active = true;
        })
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                if (callback) {
                    callback(JSON.parse(response));
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    },
    progressCallback: function (completedCount, totalCount = 1) {
        this.progress = completedCount / totalCount;
        //Linker.GameManager.loadingProgressBar
        //Linker.GameManager.loadingProgressBar.progress = this.progress;
        var precent = isNaN(Math.round(this.progress * 100)) ? "..." : Math.round(this.progress * 100);
        if (this.txtMessage) {
            this.txtMessage.string = 'Đang tải ' + precent + '%';
        }

    },

    // prepareUpdate: function () {
    //     var storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "remote-asset";
    //     this._am = new jsb.AssetsManager(this.manifestUrl.nativeUrl, storagePath);

    //     if (cc.sys.os === cc.sys.OS_ANDROID) {
    //         this._am.setMaxConcurrentTask(2);
    //     }

    //     if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
    //         // Resolve md5 url
    //         var url = this.manifestUrl.nativeUrl;
    //         if (cc.loader.md5Pipe) {
    //             url = cc.loader.md5Pipe.transformURL(url);
    //         }
    //         this._am.loadLocalManifest(url);
    //     }

    //     if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
    //         console.log('Failed to load local manifest ...');
    //     }

    //     this.hotUpdate();
    // },

    // hotUpdate: function () {
    //     if (this._am && !this._updating) {
    //         this._am.setEventCallback(this.updateCb.bind(this));

    //         if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
    //             var url = this.manifestUrl.nativeUrl;
    //             if (cc.loader.md5Pipe) {
    //                 url = cc.loader.md5Pipe.transformURL(url);
    //             }
    //             this._am.loadLocalManifest(url);
    //         }

    //         this._failCount = 0;
    //         this._updating = true;
    //         this._am.update();
    //     }
    // },
    updateCb: function (event) {
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
                if (this._failCount < 5) this._am.downloadFailedAssets();
                else {
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
                if (cc.sys.os == cc.sys.OS_IOS) {
                    this.completeCallback();
                } else {
                    cc.game.restart();
                    this.completeCallback();

                    //cc.director.runScene(new GameScene());
                }

            } else {
                this.completeCallback();
            }
        }
    }, //end add by zep

    googleAnalyticInit() {
        if (cc.sys.isNative && sdkbox.PluginGoogleAnalytics) {
            sdkbox.PluginGoogleAnalytics.init();
            //this.logEvent(PACKAGE_NAME);
        }
    },
    firebaseInit() {
        if (cc.sys.isNative && sdkbox.firebase && sdkbox.firebase.Analytics) {
            sdkbox.firebase.Analytics.init();

            //this.logEvent(PACKAGE_NAME);
        }
    },
    logEvent(event) {
        if (cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS) {
            sdkbox.PluginGoogleAnalytics.logScreen(event);
        }
    },
    chartBoostInit() {
        if (cc.sys.isNative) {
            sdkbox.PluginChartboost.init();
        }

    },
    showChartBoostFull() {
        if (cc.sys.isNative) {
            sdkbox.PluginChartboost.show("Default");
        }

    },

    adMobInit: function () {
        console.log("adMobInit");
        if (cc.sys.isNative) {
            var self = this;
            sdkbox.PluginAdMob.init();
            sdkbox.PluginAdMob.setListener({
                adViewDidReceiveAd: function (name) {
                    console.log("adViewDidReceiveAd  ");


                },
                adViewDidFailToReceiveAdWithError: function (name, msg) {

                    if (cc.sys.os == cc.sys.OS_ANDROID) {

                    }
                    if (cc.sys.os == cc.sys.OS_IOS) {

                    }
                },
                adViewWillPresentScreen: function (name) {
                    console.log("adViewWillPresentScreen  " + name);
                },
                adViewDidDismissScreen: function (name) {

                    console.log("adViewDidDismissScreen:" + name);
                    if (name == "gameover") {
                        self.cacheInterstitial();
                    }



                },
                adViewWillDismissScreen: function (name) {
                    console.log("adViewWillDismissScreen:" + name);
                },
                adViewWillLeaveApplication: function (name) {
                    console.log("adViewWillLeaveApplication  " + name);
                },
                reward(name, currency, amount) {
                    console.log("reward name:"+reward);
                    console.log("reward currency:"+currency);
                    console.log("reward amount:"+amount);
                    // quang cao da chay xong
                    // cong tienf, thuowng
                    switch (this.dataAds.action) {
                        case 1:
                            console.log("CHAY XONG QUANG CAO 1");
                            this.dataAds.script.AdsDone();
                            break;
                        case 2:
                            cc.error();
                            break;
                        case 3:
                            cc.error();
                            break;
                    }
                    // console.log("reward:" + name);
                    // if (name == "rewarded") {

                    // }
                    // if (name == "home") {
                    //     self.showRewarded();
                    // }
                    // if (name == "rewarded") {
                    //     // console.log("adViewDidReceiveAd:"+name);
                    //     // var tableGame2 = this.func.getData("tableGame2");
                    //     // tableGame2.computer3.Money += 50000; 
                    //     // this.func.setData("tableGame2",tableGame2);
                    //     // Linker.showMessage("Chúc mừng bạn đã nhận được 50.000 Xu Miễn Phí");
                    //     var event = Linker.eventGetMoney;
                    //     if (event) {
                    //         var nodeClick = event.target.parent.parent;
                    //         switch (nodeClick.name) {
                    //             //Nhan qua hang ngay khong cho vao day vi neu khong co quang cao thi cai nhan qua no se khong tat
                    //             // case "_QuaTangHangNgay":
                    //             //     break;
                    //             case "btn":             //Cai nay la Time Bonus
                    //                 Linker._DailyGift.onGetClick(event);
                    //                 break;
                    //             case "_Home":           // Cai nay la Get
                    //                 Linker.dailyGift2.onGetClick(event);
                    //                 break;
                    //         }
                    //     } else {
                    //         Linker.dailyGift2.onGetClick("");
                    //     }
                    // }
                }
            });

        }
    },
    setDataActionAds(data) {
        this.dataAds = data;
    },
    test() {
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
                break;
        }
    },
    cacheInterstitial: function () {
        if (cc.sys.isNative) {
            sdkbox.PluginAdMob.cache('interstitial');
        }
    },

    showInterstitial: function () {
        console.log("showInterstitial");
        if (cc.sys.isNative) {
            if (sdkbox.PluginAdMob.isAvailable('interstitial')) {
                sdkbox.PluginAdMob.show('interstitial');
            } else {
                this.cacheInterstitial();
            }

        }


    },
    cacheBanner: function () {
        if (cc.sys.isNative) {
            sdkbox.PluginAdMob.cache('banner');
        }
    },

    showBanner: function () {
        console.log("showBanner:");
        if (cc.sys.isNative && typeof sdkbox !== "undefined") {


            if (sdkbox.PluginAdMob.isAvailable('banner')) {
                sdkbox.PluginAdMob.show('banner');
            } else {
                console.log("cache showBanner");
                this.cacheBanner();
            }


        }
        //this.showRewarded();

    },
    showBannerHome: function () {
        console.log("showBannerHome:");
        if (cc.sys.isNative && typeof sdkbox !== "undefined") {


            if (sdkbox.PluginAdMob.isAvailable('bannerBottom')) {
                sdkbox.PluginAdMob.show('bannerBottom');
            } else {
                console.log("cache home");
                sdkbox.PluginAdMob.cache('bannerBottom');
            }


        }
        //this.showRewarded();

    },
    bannerBottom: function () {
        console.log("BannerBottom");
        if (cc.sys.isNative && typeof sdkbox !== "undefined") {
            if (sdkbox.PluginAdMob.isAvailable('bannerBottom')) {
                sdkbox.PluginAdMob.show('bannerBottom');
            } else {
                console.log("cache bannerBottom");
                sdkbox.PluginAdMob.cache('bannerBottom');
            }
        }
    },
    hideBanner: function () {
        if (cc.sys.isNative) {
            sdkbox.PluginAdMob.hide('home');
        }
    },
    cacheRewarded: function () {
        if (cc.sys.isNative) {
            sdkbox.PluginAdMob.cache('rewarded');
        }
    },
    showRewarded: function (id = "") {
        Linker.showMessage("Find ads....");
        console.log("showRewarded");
        if (cc.sys.isNative && typeof sdkbox !== "undefined") {
            if (id) {
                var rewardedid = "rewarded" + id;
                if (sdkbox.PluginAdMob.isAvailable(rewardedid)) {
                    sdkbox.PluginAdMob.show(rewardedid);
                } else {
                    console.log("cache rewarded");
                    sdkbox.PluginAdMob.cache(rewardedid);
                }
            } else {
                if (sdkbox.PluginAdMob.isAvailable("rewarded")) {
                    sdkbox.PluginAdMob.show("rewarded");
                } else {
                    console.log("cache rewarded");
                    sdkbox.PluginAdMob.cache("rewarded");
                }
            }

        }
    },
    cacheAllAds: function () {
        this.cacheBanner();
        this.cacheInterstitial();
        this.cacheRewarded();
    },
    initOneSignal() {
        if (cc.sys.isNative) {
            sdkbox.PluginOneSignal.init();
            sdkbox.PluginOneSignal.setListener({
                onSendTag: function (success, key, message) {
                    //cc.log("onSendTag success=%s, key=%s, message=%s", success ? "yes" : "no", key, message);
                },
                onGetTags: function (jsonString) {
                    //cc.log("onGetTags tags=%s", jsonString);
                },
                onIdsAvailable: function (userId, pushToken) {
                    //cc.log("onIdsAvailable userId=%s, pushToken=%s", userId, pushToken);
                    self.userId = userId;
                    self.item2.setString(userId);
                },
                onPostNotification: function (success, message) {
                    //cc.log("onPostNotification success=%s, message=%s", success ? "yes" : "no", message);
                },
                onNotification: function (isActive, message, additionalData) {
                    //cc.log("onNotification isActive=%s, message=%s, additionalData=%s", isActive ? "yes" : "no", message, additionalData);
                }
            });

            sdkbox.PluginOneSignal.setSubscription(true);
            sdkbox.PluginOneSignal.sendTag("packageName", PACKAGE_NAME);
            sdkbox.PluginOneSignal.enableInAppAlertNotification(true);
            sdkbox.PluginOneSignal.promptLocation();
        }
    },
    initIAP() {
        var self = this;
        if (cc.sys.isNative && typeof sdkbox !== "undefined") {
            sdkbox.IAP.init();
            sdkbox.IAP.setDebug(true);
            sdkbox.IAP.setListener({
                onSuccess: function (product) {
                    //Purchase success
                    self.iapListener(product.name);
                },
                onFailure: function (product, msg) {
                    //Purchase failed
                    //msg is the error message
                },
                onCanceled: function (product) {
                    //Purchase was canceled by user
                },
                onRestored: function (product) {
                    //Purchase restored
                    self.iapListener(product.name);
                },
                onRestoreComplete(ok, msg) {

                },
                onProductRequestSuccess: function (products) {
                    //Returns you the data for all the iap products
                    //You can get each item using following method
                    for (var i = 0; i < products.length; i++) {
                        // loop
                    }
                },
                onProductRequestFailure: function (msg) {
                    //When product refresh request fails.
                }
            });
        }
    },
    iap1() {
        if (cc.sys.isMobile) {
            if (sdkbox.IAP) {
                sdkbox.IAP.purchase("iap1");
            }
        }


    },
    iap2() {
        if (cc.sys.isMobile) {
            if (sdkbox.IAP) {
                sdkbox.IAP.purchase("iap2");

            }
        }

    },
    iap3() {
        if (cc.sys.isMobile) {
            if (sdkbox.IAP) {
                sdkbox.IAP.purchase("iap3");

            }
        }

    },
    iapListener(name) {
        switch (name) {

            case "iap1": {
                if (Linker.userData) {
                    Linker.userData.userMoney += 16000;
                    Linker.HallView.updateUserMoney();
                }
                break;
            }
            case "iap2": {
                if (Linker.userData) {
                    Linker.userData.userMoney += 20000;
                    Linker.HallView.updateUserMoney();
                }
                break;
            }
            case "iap3": {
                if (Linker.userData) {
                    Linker.userData.userMoney += 31000;
                    Linker.HallView.updateUserMoney();
                }
                break;
            }
        }
    },

});
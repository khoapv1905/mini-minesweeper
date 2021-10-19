cc.Class({
    extends: cc.Component,

    properties: {
        loop: true,
        soundVolume:{
            default: 1,
            range: [0,1,0.1],
            slide: true,
            notify(){
                this.setVolume();
            }
        },
        AudioClipPool: {
            default: [],
            type: cc.AudioClip,
        },
        _isPlaying: true,
        _audioId: null,
        _effectId: null,
    },

    onLoad(){
        let soundData = JSON.parse(cc.sys.localStorage.getItem("soundOff"));
        if(soundData != null){
           this._isPlaying = soundData; 
        }else{
            soundData = true;
            this._isPlaying = soundData;
        }
    },
    playEffectSound(command, loop){
        if(loop === null && loop === undefined){
            var loop = this.loop;
        }
        if(!this._isPlaying){
            return;
        }
        if(command !==null || command !== undefined ){
            switch(command){
                case"clickMap":
                    this._effectId = cc.audioEngine.playEffect(this.AudioClipPool[0],loop);
                    break;
                case"popUp":
                    this._effectId = cc.audioEngine.playEffect(this.AudioClipPool[1],loop);
                    break;
                case"win":
                    this._effectId = cc.audioEngine.playEffect(this.AudioClipPool[2],loop);
                    break;
                case"fail":
                    this._effectId = cc.audioEngine.playEffect(this.AudioClipPool[3],loop);
                    break;
                case"touch": 
                    this._effectId = cc.audioEngine.playEffect(this.AudioClipPool[4],loop);
                    break;
                case "click":
                    this._effectId = cc.audioEngine.playEffect(this.AudioClipPool[5],loop);
                    break;
                case "scrollMap":
                    this._effectId = cc.audioEngine.playEffect(this.AudioClipPool[6],loop);
                    break;
                default: 
                    cc.error("command is invalid");
                    break;
            }
        }
    },
    stopAll(){
        if(!this._isPlaying){
            return;
        }
        // switch (command){
        //     case"explore":
        //         cc.audioEngine.stop(this.AudioClipPool[0]);
        //         break;
        //     case"popUp":
        //         cc.audioEngine.stop(this.AudioClipPool[1]);
        //         break;
        //     case"win":
        //         cc.audioEngine.stop(this.AudioClipPool[2]);
        //     break;
        //         case"fail":
        //     cc.audioEngine.stop(this.AudioClipPool[3]);
        //         break;
        //     case"touch":
        //         cc.audioEngine.stop(this.AudioClipPool[4]);
        //         break;
        //     case"click":
        //         cc.audioEngine.stop(this.AudioClipPool[5]);
        //         break;
        //     case"scrollMap":
        //         cc.audioEngine.stop(this.AudioClipPool[6]);
        //         break;
        //     default: 
        //         break;

        // }
        // cc.audioEngine.stopAll();
        // this._audioId =null;
    }

    
});

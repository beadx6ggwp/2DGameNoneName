class assetLoader {
    constructor(asset, callback) {
        this.callback = callback;

        this.imgs = asset['img'] || {};
        this.sounds = asset['sound'] || {};

        this.assetsLoaded = 0;
        this.numImgs = Object.keys(this.imgs).length;
        this.numSounds = Object.keys(this.sounds).length;
        this.totalAsset = this.numImgs + this.numSounds;

        console.log(`numImgs:${this.numImgs}`, `numSounds:${this.numSounds}`);

        this.run();
    }
    run() {
        var self = this;
        var src = '';
        for (let img in this.imgs) {
            src = this.imgs[img];
            var _img = new Image();
            _img.onload = (e) => self.loaded(e);
            _img.onerror = (e) => console.log('load error:', e.srcElement);
            _img.src = src;

            // document.body.appendChild(_img);
            this.imgs[img] = _img;
        }

        for (let sound in this.sounds) {
            src = this.sounds[sound];
            var _sound = new Audio();
            _sound.oncanplay = (e) => self.loaded(e);
            _sound.onerror = (e) => console.log('load error:', e.srcElement);
            _sound.src = src;
            this.sounds[sound] = _sound;
        }
    }
    loaded(e) {
        this.assetsLoaded++;
        if (this.callback) {
            this.callback(e, this.assetsLoaded, this.totalAsset);
            return;
        }

        console.log(this.assetsLoaded, this.totalAsset);
        if (this.assetsLoaded == this.totalAsset) {
            this.completeLoad();
        }
    }
    completeLoad() {
        console.log("GOOD OK");
    }
}
class Frame {
    constructor(x, y, w, h, img, dur) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.img = img || null;
        this.duration = dur || 0;
    }
}
class Frames {
    constructor(name, img, duration) {
        // 序列集合名稱
        this.name = name;

        // 對應的預設序列圖
        this.img = img;

        // 每幀預設持續時間(ms)
        this.duration = duration || 50;

        // 每幀的資料
        this.frames = [];
    }

    add(frame) {
        if (frame instanceof Frame) {
            this.frames.push(frame);
        } else {
            let x = arguments[0], y = arguments[1],
                w = arguments[2], h = arguments[3],
                img = arguments[4] || this.img,
                dur = arguments[5] || this.duration;
            let frame = new Frame(x, y, w, h, img, dur);
            this.frames.push(frame);
        }
        return this.frames;
    }

    remove(index) {
        return this.frames.splice(index, 1);
    }

    clear() {
        this.frames = [];
    }

    get(index) {
        return this.frames[index];
    }
    getCount() {
        return this.frames.length
    };
}

class AnimationGroup {
    constructor() {
        this.anims = {};
    }

    add(name, frames) {
        this.anims[name] = frames;
    }
    remove(name) {
        this.anims[name] = null;
    }
    clear() {
        this.anims = {};
    }
    getAllNames() {
        let names = [];
        for (const name of this.anims) {
            names.push(name);
        }
        return names;
    }
    get(name) {
        return this.anims[name];
    }
}

class Animation {
    constructor(config) {
        config = config || {};

        // AnimationGroup
        this.animGroup = null;

        // current Frames
        this.currFrames = null;

        this.repeat = true;

        // 播放的速度倍數
        this.speed = 1;

        // frame current frame index
        this.currFidx = null;

        // frame start index
        this.fsIdx = null;

        // frame end index
        this.feIdx = null

        this.accumulator = 0;

        // 設定更新animationFrame的方法
        this.updateFrame = GetValue(config, 'update', this.defUpdate);
    }
    defUpdate() {
        this.accumulator += FrameState.deltaTime * this.speed;

        // 是否該用while()來處理accumulator超量?
        let nextDuration = this.getCurrFrames().duration;
        if (this.accumulator > nextDuration) {
            // debugger
            this.accumulator -= nextDuration;

            let nextIdx = this.currFidx + 1;

            // 已經輪播結束
            if (nextIdx >= this.feIdx && !this.repeat) {
                return;
            }
            this.currFidx = nextIdx % this.feIdx;
        }
    }

    resetAction() {
        this.repeat = true;
        this.speed = 1;

        this.currFidx = 0;
        this.fsIdx = 0;
        this.feIdx = this.currFrames.getCount();

        this.accumulator = 0;
    }

    setAnimGroup(animGroup, currAnimName) {
        this.animGroup = animGroup;
        this.setCurrFrames(currAnimName || 'def');
    }
    setCurrFrames(name) {
        let frames = this.animGroup.get(name);
        // if frames change
        if (frames != this.currFrames) {
            this.currFrames = frames;
            this.resetAction();
        }
    }

    getCurrFrames() {
        if(!this.currFrames) return null;
        return this.currFrames.get(this.currFidx);
    }
    getNextFrames() {
        this.updateFrame();
        return this.getCurrFrames();
    }

    isFirstFrame() {
        return this.currFidx == this.fsIdx;
    }
    isLastFrame() {
        return this.currFidx == this.feIdx;
    }
}
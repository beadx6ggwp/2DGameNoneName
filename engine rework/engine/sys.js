var FrameState = {
    tickCount: 0,
    //最大幀數
    maxFrame: 0,
    //最小幀數
    minFrame: 9999,
    // 基於time seq的預測平均
    predictFrame: 60,
    alpha: 0.25,
    //即時幀數
    currFrame: 0,
    //當前時間
    currTime: 0,
    //每幀流逝的時間
    deltaTime: 0,
    //用於統計每秒開始時間
    lastUpdate: 0,
    //統計每秒總幀數
    framesThisSecond: 0,
    //啟動幀狀態檢測器
    start: function () {
        this.currFrame = 0;
        this.currTime = this.lastUpdate = window.performance.now();
        this.predictFrame = 60;
        this.framesThisSecond = 0;
        this.tickCount = 0;
    },
    //每幀在遊戲循環前調用此方法，更新和計算幀數
    update: function () {
        var timestamp = window.performance.now();
        // FPS Counter
        // exponential moving average: http://alptbag.blogspot.com/2014/02/maema.html
        // alpha表示衰減，用來處理最近幾秒的FPS更新
        // FPS(n+1) = FPS(n) + alpha(FpsNow - FPS(n))
        // (thisSecond - fps)為當前幀數與上秒的物差
        // 預測當前的FPS等於上次結果加上這次的誤差，為了避免數值變化太快，所以加個衰減參數alpha

        if (timestamp >= this.lastUpdate + 1000) {
            this.currFrame = this.framesThisSecond;
            this.maxFrame = (this.currFrame > this.maxFrame) ? this.currFrame : this.maxFrame;
            this.minFrame = (this.currFrame < this.minFrame) ? this.currFrame : this.minFrame;
            this.predictFrame = this.currFrame * this.alpha + this.predictFrame * (1 - this.alpha);

            this.framesThisSecond = 0;
            this.lastUpdate = timestamp;
        }
        else {
            this.framesThisSecond++;
        }
        this.deltaTime = timestamp - this.currTime;
        this.currTime = timestamp;
        this.tickCount++;
    }
};

var FPStats = new Stats();
document.body.appendChild(FPStats.dom);
FPStats.showPanel(0);



var Key = {
    states: new Array(255),
    clearKeyStates: function () {
        for (var i = 0; i < 255; i++) {
            this.states[i] = 0;
        }
    },
    setEnabled: function (flag) {
        let self = this;
        if (flag) {
            document.addEventListener('keydown', keyDown, false);
            document.addEventListener('keyup', keyUp, false);
        } else {
            document.removeEventListener('keydown', keyDown, false);
            document.removeEventListener('keyup', keyUp, false);
        }
    },
    pressed: function (keyChar) {
        if (typeof keyChar == 'string') return this.states[KeyValue[keyChar]];
        return this.states[keyChar];
    }
}
Key.setEnabled(true);

function keyDown(e) {
    Key.states[e.keyCode] = 1;
};

function keyUp(e) {
    Key.states[e.keyCode] = 0;
};


var KeyValue = {
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    N0: 48,
    N1: 49,
    N2: 50,
    N3: 51,
    N4: 52,
    N5: 53,
    N6: 54,
    N7: 55,
    N8: 56,
    N9: 57,
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40,
    ENTER: 13,
    SPACE: 32,
    TAB: 9,
    SHIFT: 16,
    ALT: 18,
    CTRL: 17
}
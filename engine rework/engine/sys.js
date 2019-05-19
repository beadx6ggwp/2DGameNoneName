(function (win) {

    var _FState = win.FrameState = {
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
        elapseTime: 0,
        //用於統計每秒開始時間
        lastUpdate: 0,
        //統計每秒總幀數
        framesThisSecond: 0,
        //啟動幀狀態檢測器
        start: function () {
            this.currFrame = 0;
            this.currTime = this.lastUpdate = win.performance.now();
            this.predictFrame = 60;
            this.framesThisSecond = 0;
        },
        //每幀在遊戲循環前調用此方法，更新和計算幀數
        update: function () {
            var timestamp = win.performance.now();
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
            this.elapseTime = timestamp - this.currTime;
            this.currTime = timestamp;
        }
    };


}(window))
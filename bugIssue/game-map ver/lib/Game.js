/*
callback = {
    update: func,
    render: func
}

config = {
    width:800,
    height:600,
    canvasOnCenter:1,
    updateStep:1/60
}
*/

// console.log("import game");
class Game {
    constructor(callback, config = {}) {
        // sitting canvas
        this.width = GetValue(config, 'width', 800);
        this.height = GetValue(config, 'height', 600);
        this.canvasOnCenter = GetValue(config, 'canvasOnCenter', 1);
        this.ctx = CreateDisplay("GameCanvas", this.width, this.height, this.canvasOnCenter);
        this.ctx.imageSmoothingEnabled = false;

        // sitting input
        this.keys = {}
        this.mousePos = { x: 0, y: 0, isDown: false };
        this.canvasRect = this.ctx.canvas.getBoundingClientRect();
        var canvas = this.ctx.canvas;
        document.addEventListener("keydown", (e) => this.keys[e.keyCode] = true, false);
        document.addEventListener("keyup", (e) => delete this.keys[e.keyCode], false);
        document.addEventListener("mousedown", (e) => this.mousePos.isDown = true, false);
        document.addEventListener("mouseup", (e) => this.mousePos.isDown = false, false);
        document.addEventListener("mousemove", (e) => {
            // var rect = this.canvasRect;
            var rect = this.ctx.canvas.getBoundingClientRect();
            // Math.floor(rect.left)
            this.mousePos.x = e.clientX - Math.floor(rect.left);
            this.mousePos.y = e.clientY - Math.floor(rect.top);
        }, false);
        this.ctx.scale(1, 1);

        // sitting loop
        this.updateStep = GetValue(config, 'updateStep', 1 / 10);
        this.callback = callback;

        this.loop = new Timer({
            update: (dt, tick) => callback.update(dt, tick),
            render: (interp) => callback.render(this.ctx, interp)
        }, this.updateStep);
    }

    start() {
        this.loop.start()
    }
}

function Timer(callback, step) {
    var stats = new Stats();
    document.body.appendChild(stats.dom);
    stats.showPanel(0);

    var rafID,
        lastTime = 0,
        accumulator = 0,
        tickcount = 0,
        stepTime = step || 1 / 120,
        isRunning = false,
        isStarted = false;

    var panicMax = 120;

    var defaultFPS = 60;

    var fps = defaultFPS,
        lastFpsUpdate = 0,
        framesThisSecond = 0,
        alpha = 0.25;

    var deltaHistory = [];

    // Runge Kutta order 4(RK4)，數值分析
    // https://gafferongames.com/post/integration_basics/
    // timestamp 相當於 window.performance.now()
    function onFrame(timestamp) {
        // console.log(timestamp)
        stats.begin();

        if (isRunning) {
            accumulator += (timestamp - lastTime) / 1000;
            lastTime = timestamp;
        }

        // callback.begin()

        // FPS Counter
        // exponential moving average: http://alptbag.blogspot.com/2014/02/maema.html
        // alpha表示衰減，用來處理最近幾秒的FPS更新
        // FPS(n+1) = FPS(n) + alpha(FpsNow - FPS(n))
        // (thisSecond - fps)為當前幀數與上秒的物差
        // 預測當前的FPS等於上次結果加上這次的誤差，為了避免數值變化太快，所以加個衰減參數alpha
        if (timestamp > lastFpsUpdate + 1000) {
            fps = alpha * framesThisSecond + (1 - alpha) * fps;
            lastFpsUpdate = timestamp;
            framesThisSecond = 0;
            // console.log(fps);
        }
        framesThisSecond++;

        // 用意就是讓update()以時間做為更新的依據
        // 或是當物體移動距離大的時候，就需要提高update()更新的速度，以更精準檢測每次更新移動的距離
        // 物體移動速度為1000 px/s，在更新率20的狀況，相當於每次更新時移動50px
        // 而更新率100的時候，相當於每次更新時只移動10px，自然能更加精準
        // 但更新率100時，相當於0.01ms更新一次，但raf的更新平率是60hz = 16.67ms
        // 為了達成100hz的更新，所以在每次raf的時候，就要連續更新16次左右，以模擬100hz的更新頻率
        var numUpdateSteps = 0;
        while (accumulator > stepTime && isRunning) {
            callback.update(stepTime, tickcount);
            tickcount++;
            accumulator -= stepTime;

            // 當瀏覽器切窗時raf並不會更新，但切窗回來時timestamp卻還在累加，或是延遲發生時，做的應對處理
            // numUpdateSteps相當於計數這幀更新了幾次，當落後太多的時候，就要執行修正
            // 像是切窗之前 accumulator = 0,回來後變成1000，相當於落後1s
            // 以stepTime:10ms來看下一幀就會需要跑100次來彌補，所以物體就會順移一段之類的
            // 或是短時間大量update()導致下一幀也延遲，然後為了保持模擬又繼續while (accumulator > stepTime){...}
            // 以此類推，最後導致卡死，所以再出現意外的時候需要修正
            if (++numUpdateSteps >= panicMax) {
                // Maybe numUpdateSteps / stepTime >= panicMax ?
                panic()
                break;
            }
        }

        // interp  = accumulator / stepTime
        callback.render(accumulator / stepTime);

        // callback.end()

        stats.end();

        rafID = requestAnimationFrame(onFrame);
    }

    function panic() {
        // 而最簡單的修正方法就是將要追趕的accumulator重製
        console.log('accumulator reset');
        accumulator = 0;
    }

    function start() {
        if (isStarted) return;
        isRunning = true;
        isStarted = true;
        reset();

        rafID = requestAnimationFrame(onFrame);
    }

    // 暫停update()，但繼續render()
    function pause() {
        if (!isRunning) reset();
        isRunning = !isRunning;
    }
    function stop() {
        isRunning = false;
        isStarted = false;
        cancelAnimationFrame(rafID);
    }

    function reset() {
        // reset timestamp
        lastTime = window.performance.now();
        lastFpsUpdate = window.performance.now();
        framesThisSecond = 0;
    }
    function FPS() {
        return fps;
    }
    function getStatus() {
        return {
            isRunning: isRunning,
            isStarted: isStarted
        };
    }

    return {
        start: start,
        pause: pause,
        stop: stop,
        FPS: FPS,
        status: getStatus()
    };
}


function GetValue(source, key, defaultValue) {
    if (source.hasOwnProperty(key)) {
        return source[key];
    }

    return defaultValue;
}

function CreateDisplay(id, width, height, center, border) {
    let div = document.createElement("div");
    div.id = "divForCanvas";

    // canvas sitting
    let canvas = document.createElement("canvas");
    let style_arr = [
        "display: block;",
        "margin: 0 auto;",
        // "background: #FFF;",
        "padding: 0;"
    ];
    canvas.id = id;
    width = width || window.innerWidth;
    height = height || window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    if (border) style_arr.push("border:1px solid #000;");

    canvas.style.cssText = style_arr.join("");

    // 是否要畫面置中
    if (center) {
        div.style.cssText = [
            "position:absolute;",
            "width:" + width + "px;",
            "height:" + height + "px;",
            "left:50%;",
            "top:50%;",
            "margin-top: -" + height / 2 + "px;",
            "margin-left: -" + width / 2 + "px;",
            "background:#000;"
        ].join("");

        document.body.appendChild(div);
        div.appendChild(canvas);
    } else {
        document.body.appendChild(canvas);
    }

    return canvas.getContext("2d");
}

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
class Game {
    constructor(callback, config = {}) {
        // sitting canvas
        this.width = GetValue(config, 'width', 800);
        this.height = GetValue(config, 'height', 600);
        this.canvasOnCenter = GetValue(config, 'canvasOnCenter', 1);
        this.ctx = CreateDisplay("GameCanvas", this.width, this.height, this.canvasOnCenter);

        // sitting input
        this.keys = {}
        this.mousePos = { x: 0, y: 0, isDown: false };
        var canvas = this.ctx.canvas;
        canvas.addEventListener("keydown",
            (e) => {
                keys[e.keyCode] = true;
            }, false);
        canvas.addEventListener("keyup",
            (e) => {
                delete keys[e.keyCode];
            }, false);
        canvas.addEventListener("mousedown",
            (e) => {
                this.mousePos.isDown = true;
            }, false);
        canvas.addEventListener("mouseup",
            (e) => {
                this.mousePos.isDown = false;
            }, false);
        canvas.addEventListener("mousemove",
            (e) => {
                var rect = this.ctx.canvas.getBoundingClientRect();
                mousePos.x = e.clientX - Math.floor(rect.left);
                mousePos.y = e.clientY - Math.floor(rect.top);
                // console.log(mousePos);
            }, false);

        // sitting loop
        this.updateStep = GetValue(config, 'updateStep', 1 / 120);
        this.callback = callback;

        this.loop = new Timer({
            update: (dt, tick) => {
                callback.update(dt, tick)
            },
            render: () => {
                callback.render(this.ctx)
            }
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

    var timeNow = 0,
        lastTime = 0,
        accumulator = 0,
        tickcount = 0,
        stepTime = step || 1 / 120,
        isRunning = false,
        isStarted = false;

    function onFrame(timestamp) {
        stats.begin();
        accumulator += (timestamp - lastTime) / 1000;
        while (accumulator > stepTime && isRunning) {
            callback.update(stepTime, tickcount);
            tickcount++;
            accumulator -= stepTime;
        }

        lastTime = timestamp;
        callback.render();

        stats.end();
        if (isStarted) {
            requestAnimationFrame(onFrame);
        }
    }
    function start() {
        isRunning = true;
        isStarted = true;
        requestAnimationFrame(onFrame);
    }
    function pause() {
        isRunning = !isRunning;
    }
    function stop() {
        isRunning = false;
        isStarted = false;
    }

    return {
        start: start,
        pause: pause,
        stop: stop
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

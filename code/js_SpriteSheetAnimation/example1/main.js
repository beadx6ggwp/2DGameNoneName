var cnavas,
    ctx,
    width,
    height;
var animation,
    lastTime = 0,
    Timesub = 0,
    DeltaTime = 0,
    loop = true;
var ctx_font = "Consolas",
    ctx_fontsize = 10,
    ctx_backColor = "#777";

window.onload = function () {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    main();
}

var walk = [];
var source = [
    {
        speed: 30,
        frameWidth: 44,
        frameHeight: 40,
        startFrame: 0,
        endFrame: 9,
        path: "source/coin-sprite-sheet.png"
    },
    {
        speed: 1,
        frameWidth: 80,
        frameHeight: 80,
        startFrame: 0,
        endFrame: 4,
        path: "source/frame-sprite-animation.png"
    },
    {
        speed: 50,
        frameWidth: 125,
        frameHeight: 125,
        startFrame: 0,
        endFrame: 15,
        path: "source/spritesheet.png"
    },
    {
        speed: 10,
        frameWidth: 90,
        frameHeight: 140,
        startFrame: 0,
        endFrame: 7,
        path: "source/sheet1.png"
    },
    {
        speed: 50,
        frameWidth: 1200/5,
        frameHeight: 1570/5,
        startFrame: 0,
        endFrame: 21,
        path: "source/robin.png"
    }
];

function main() {
    console.log("Start");

    for (let i = 0; i < source.length; i++) {
        let s = source[i];
        let spritesheet = new SpriteSheet(s.path, s.frameWidth, s.frameHeight);
        walk.push(new Animation(spritesheet, s.speed, s.startFrame, s.endFrame));
    }


    window.requestAnimationFrame(mainLoop);
    //mainLoop();
}

function mainLoop(timestamp) {
    Timesub = timestamp - lastTime;// get sleep
    DeltaTime = Timesub / 1000;
    lastTime = timestamp;
    //Clear
    ctx.fillStyle = ctx_backColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //--------Begin-----------

    update(DeltaTime);
    draw(ctx);


    //--------End---------------
    let str1 = "Fps: " + 1000 / Timesub, str2 = "Timesub: " + Timesub, str3 = "DeltaTime: " + DeltaTime;
    drawString(ctx, str1 + "\n" + str2 + "\n" + str3,
        0, height - 31,
        "#FFF", 10, "consolas",
        0, 0, 0);
    if (loop) {
        animation = window.requestAnimationFrame(mainLoop);
    } else {
        // over
    }
}

function update(dt) {
    for (let i = 0; i < walk.length; i++) {
        walk[i].update();
    }
}

function draw(ctx) {
    let heightCount = 0;
    for (let i = 0; i < walk.length; i++) {
        walk[i].draw(ctx, 0, heightCount);
        heightCount += source[i].frameHeight;
    }
}
//-----------------------------






//----tool-------
function toRadio(angle) {
    return angle * Math.PI / 180;
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function random(min, max) {
    return Math.random() * (max - min) + min;
}
var ctx,
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
var keys = {}, mousePos = {};

window.onload = function () {
    // ctx = CreateDisplay("myCanvas");

    main();
}

// ----------------------------------------------------------

var game;
var asset;

function main() {
    console.log("Start");

    asset = new assetLoader({
        img: {
            img1: 'asset/1.jpg',
            img2: 'asset/2.jpg',
            img3: 'asset/3.jpg',
            img4: 'asset/4.png',
            img5: 'asset/5.jpg',
            img6: 'asset/6.jpg',
            img7: 'asset/7.jpg',
        },
        sound: {
            mu1: 'asset/player_hit.wav'
        }
    });

    game = new Game({
        update: update,
        render: draw
    });
    game.start();
}

var point = { x: 0, y: 50 };


function update(dt) {
    // console.log(dt);
    point.x += dt * 100;
    if (point.x >= game.width) point.x = 0;

}

function draw(ctx) {
    ctx.fillStyle = ctx_backColor;
    ctx.fillRect(0, 0, game.width, game.height);

    ctx.drawImage(asset.imgs.img1, 0, 0);

    ctx.fillStyle = "#FFF";
    ctx.fillRect(point.x, point.y, 20, 20);

    let r = 40;
    drawString(ctx, mousePos.x + ", " + mousePos.y, mousePos.x, mousePos.y - 15, "#FF0", 10);

}
function renderDebuger(list) {

}

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
function sleep(milliseconds) {
    var start = new Date().getTime();
    while (1)
        if ((new Date().getTime() - start) > milliseconds)
            break;
}

//---------------------
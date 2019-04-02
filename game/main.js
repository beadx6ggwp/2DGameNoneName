var ctx_font = "Consolas",
    ctx_fontsize = 10,
    ctx_backColor = "#777";

// preload
window.onload = function () {
    console.log("PreLoad...");
    var assetCallback = (obj, count, total) => {
        document.getElementsByTagName('h1')[0].innerHTML = `${Math.round(count / total * 100)}%`

        var pBar = document.getElementById('progress-bar');

        pBar.value = count / total;
        if (count == total) {
            console.log('Start');
            main();
        }
    }
    asset = new assetLoader({
        img: {
            img1: 'asset/1.jpg'
        },
        sound: {
            
        }
    }, assetCallback);
    // main();
}

// ----------------------------------------------------------

var game;
var asset;

function main() {

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
    let mousePos = game.mousePos;
    drawString(ctx, mousePos.x + ", " + mousePos.y, mousePos.x, mousePos.y - 15, "#FF0", 10);

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
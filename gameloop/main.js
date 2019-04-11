var ctx_font = "Consolas",
    ctx_fontsize = 10,
    ctx_backColor = "#EEE";

var game;
var asset;
var assetSource = {
    img: {

    },
    sound: {

    }
};
function preload() {
    console.log("PreLoad...");

    var assetCallback = (obj, count, total) => {
        document.getElementById('progressNum').innerHTML = `${count}/${total}`
        var pBar = document.getElementById('progress-bar');
        pBar.value = count / Math.max(total, 1)
        console.log('loaded:' + count / Math.max(total, 1))
        // console.log(minsecms(), obj.path[0].src)
        if (count >= total) {
            init()
        }
    }

    asset = new assetLoader(assetSource, assetCallback);

}
function init() {
    main();
}

function main() {
    console.log('Start');

    game = new Game({
        update: update,
        render: draw
    });
    game.start();
}

var point = { x: 0, y: 50 };


function update(dt, tickcount) {
    // console.log(dt);
    point.x += dt * 100;
    if (point.x >= game.width) point.x = 0;
}


function draw(ctx, interp) {
    // clear
    ctx.fillStyle = ctx_backColor;
    ctx.fillRect(0, 0, game.width, game.height);

    // draw
    ctx.fillStyle = "#FFF";
    ctx.fillRect(point.x, point.y, 20, 20);

    // debug
    let r = 40;
    let mousePos = game.mousePos;
    drawString(ctx, mousePos.x + ", " + mousePos.y, mousePos.x, mousePos.y - 15, "#000", 10);

    drawString(ctx, 'FPS : ' + game.loop.FPS().toFixed(3) + "", 0, 0, "#000", 10);
}


//---------------------
window.onload = function () {
    preload()
}

window.onblur = function () {
    if (game) game.loop.pause()
}

window.onfocus = function () {
    if (game) game.loop.pause()
}

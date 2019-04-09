var ctx_font = "Consolas",
    ctx_fontsize = 10,
    ctx_backColor = "#333";

var game;
var asset;

var assetSource = {
    img: {
        
    },
    sound: {

    }
};

function init() {
    console.log("PreLoad...");

    var assetCallback = (obj, count, total) => {
        document.getElementById('progressNum').innerHTML = `${Math.round(count / total * 100)}%`

        var pBar = document.getElementById('progress-bar');
        pBar.value = count / total;

        console.log(minsecms(), obj.path[0].src)
        if (count == total) {
            main();
        }
    }

    asset = new assetLoader(assetSource, assetCallback);
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
    drawString(ctx, mousePos.x + ", " + mousePos.y, mousePos.x, mousePos.y - 15, "#FF0", 10);

    drawString(ctx, 'FPS : ' + game.loop.FPS().toFixed(3) + "", 0, 0, "#FFF", 10);
}


//---------------------
window.onload = function () {
    init();
}

window.onblur = function () {
    // console.log("blur:" + point.x);
    game.loop.pause()
}

window.onfocus = function () {
    // console.log("focus:" + point.x);
    game.loop.pause()
}

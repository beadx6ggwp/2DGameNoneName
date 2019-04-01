var ctx_font = "Consolas",
    ctx_fontsize = 10,
    ctx_backColor = "#777";

var game;
var asset;

var assetSource = {
    img: {
        img1: 'asset/1.jpg'
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
        if (count == total) {
            console.log('Start');
            main();
        }
    }

    asset = new assetLoader(assetSource, assetCallback);
}

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


//---------------------

window.onload = function () {
    init();
}
var ctx_font = "Consolas",
    ctx_fontsize = 10,
    ctx_backColor = "#EEE";

//
var assetSource = {
    imgs: {
        player: 'asset/ani1.png',
        player2: 'asset/ani2.png'
    },
    sounds: {

    }
};
var aniData = {
    'player': {
        // centerPos :原圖人物中心
        pos: { x: 50, y: 50 },
        collider: {
            x: -8, y: 0,
            w: 16, h: 12
        },
        speed: 15,
        frameWidth: 17,
        frameHeight: 25,
        renderScale: 2,
        imgName: 'player',
        action: {
            'walk-up': '10,11,12,13,12,11,10,9,8,7,8,9',
            'walk-down': '3,4,5,6,5,4,3,2,1,0,1,2',
            'walk-left': '24,25,26,27,26,25,24,23,22,21,22,23',
            'walk-right': '17,18,19,20,19,18,17,16,15,14,15,16',
            'stand-up': '10',
            'stand-down': '3',
            'stand-left': '24',
            'stand-right': '17'
        }
    },
    'player2': {
        centerPos: {
            x: 32,
            y: 32
        },
        speed: 10,
        frameWidth: 64,
        frameHeight: 64,
        renderScale: 2,
        imgName: 'player2',
        action: {
            'walk-up': '0-8',
            'walk-down': '18-26',
            'walk-left': '9-17',
            'walk-right': '27-35',
            'stand-up': '0',
            'stand-down': '18',
            'stand-left': '9',
            'stand-right': '27'
        }
    }
}

var map = {
    tileWidth: 32,
    tileHeight: 32,
    cols: 40,
    rows: 30,
    tilegap: 1,
    data: [
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2,
        2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2,
        2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2,
        2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 2,
        2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2,
        2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2,
        2, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2,
        2, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 2,
        2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 2,
        2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2,
        2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2,
        2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2,
        2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2,
        2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2,
        2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2,
        2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2,
        2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 2,
        2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 2,
        2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2,
        2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2,
        2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2,
        2, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2,
        2, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2,
        2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 2,
        2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 2,
        2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2,
        2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2,
        2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2,
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2
    ]
}
function posToIndex(map, row, col) {
    return row * map.cols + col;
}

function getTileTypeFromPos(map, row, col) {
    return map.data[posToIndex(map, row, col)];
}

var camera = {
    width: 800,
    height: 600,
    pos: new Vector(),
    follow: function (gameObj) {
        this.pos.x = gameObj.pos.x - this.width / 2;
        this.pos.y = gameObj.pos.y - this.height / 2;
    }
};

var game;
var asset;
var player;

function preload() {
    console.log("PreLoad...");
    asset = new assetLoader(assetSource, (obj, count, total) => {
        console.log(`loaded: ${count}/${total}`)
        if (count >= total)
            init()
    });
}

function init() {

    player = new Player(aniData['player']);

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

var lastShow = window.performance.now();
function update(dt, tickcount) {
    // console.log(dt);    

    player.update(dt);

    camera.follow(player);

    if (lastShow + 1000 < window.performance.now()) {
        console.log(camera.pos, { maxX: camera.pos.x + camera.width, maxY: camera.pos.y + camera.height });
        lastShow = window.performance.now();
    }
}


function draw(ctx, interp) {
    // clear
    ctx.fillStyle = ctx_backColor;
    ctx.fillRect(0, 0, game.width, game.height);
    ctx.save();
    // draw
    ctx.translate(-camera.pos.x, -camera.pos.y);
    // drawMap(ctx, map);
    drawMapWithCamera(ctx, map, camera);

    var pImg = asset.imgs.player;
    ctx.drawImage(pImg, 0, 200, pImg.width, pImg.height);

    player.draw(ctx);

    // debug
    let r = 40;
    let mousePos = game.mousePos;
    drawString(ctx, mousePos.x + ", " + mousePos.y, mousePos.x, mousePos.y - 15, "#000", 10);

    drawString(ctx, 'FPS : ' + game.loop.FPS().toFixed(3) + "", 0, 0, "#000", 10);
    ctx.restore();
}

function drawMap(ctx, map) {
    var tw = map.tileWidth;
    var th = map.tileHeight;
    for (var row = 0; row < map.rows; row++) {
        for (var col = 0; col < map.cols; col++) {
            var tile = getTileTypeFromPos(map, row, col);
            var x = (col * tw);
            var y = (row * th);

            if (tile == 2) {
                ctx.fillStyle = '#FF7F27';
            }
            else if (tile == 3) {
                ctx.fillStyle = '#00A2E8';
            }
            else if (tile == 4) {
                ctx.fillStyle = '#FFC90E';
            }
            ctx.strokeStyle = "rgba(255,255,255,0.1)";
            ctx.fillRect(x, y, tw, th);
            ctx.strokeRect(x + 0.5, y + 0.5, tw, th);
        }
    }
}
function drawMapWithCamera(ctx, map, camera) {
    let tw = map.tileWidth*1;
    let th = map.tileHeight*1;

    let start = {
        x: Math.floor(camera.pos.x / tw),
        y: Math.floor(camera.pos.y / th)
    }
    let end = {
        x: Math.floor((camera.pos.x + camera.width) / tw),
        y: Math.floor((camera.pos.y + camera.height) / th)
    }
    let startPos = new Vector(camera.pos.x / tw, camera.pos.y / th).toFixed(0);
    let endPos = new Vector((camera.pos.x + camera.width) / tw, (camera.pos.y + camera.height) / th).toFixed(0);
    // console.log(startPos, endPos)
    // Number(endPos.x)可用 x(3~28),y(3~22)
    // endPos.x會有一段空白? y也一樣
    // 目前感覺是因為toFixed(0)，用Math.floor就正常，但toFixed把下面迴圈轉整數還是怪怪
    // 而且會有無限卷軸問題，地圖還越來越歪

    // start end 就不會有空白問題，但還是有無限卷軸，越往右越高

    // console.log(start, end)
    for (let row = startPos.y; row < endPos.y; row++) {
        for (let col = startPos.x; col < endPos.x; col++) {
            let tile = getTileTypeFromPos(map, row, col);

            let x = Number(col * tw);
            let y = Number(row * th);

            if (tile == 2) {
                ctx.fillStyle = '#FF7F27';
            }
            else if (tile == 3) {
                ctx.fillStyle = '#00A2E8';
            }
            else if (tile == 4) {
                ctx.fillStyle = '#FFC90E';
            }
            // ctx.strokeStyle = "rgba(255,255,255,0.1)";
            ctx.fillRect(x, y, tw, th);
            // ctx.strokeRect(x + 0.5, y + 0.5, tw, th);
        }
    }
}

//--------------------

window.addEventListener("keydown", (e) => {
}, false);

window.addEventListener("keyup", (e) => {
}, false);

//---------------------
window.onload = function () {
    preload()
}

window.onblur = function () {
    if (game) game.loop.stop()
}

window.onfocus = function () {
    if (game) game.loop.start()
}


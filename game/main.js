var ctx_font = "Consolas",
    ctx_fontsize = 10,
    ctx_backColor = "#555";

//
var gameConfig = {
    width: 800,
    height: 600,
    canvasOnCenter: 1,
    updateStep: 1 / 120 // 更新頻率太低會導之碰撞回饋抖動
}
var assetSource = {
    imgs: {
        player: 'asset/ani1.png',
        player2: 'asset/ani2.png',
        tilecolor: 'asset/tilecolor.png'
    },
    sounds: {

    }
};
var aniData = {
    'player': {
        // centerPos
        pos: { x: 50, y: 50 },
        collider: {
            x: -16, y: 0,
            w: 32, h: 24
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

var game;
var camera
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

    game = new Game({
        update: update,
        render: draw
    }, gameConfig);

    player = new Player(aniData['player']);
    camera = new Camera(map);
    camera.width = gameConfig.width;
    camera.height = gameConfig.height;

    main();
}

function main() {
    console.log('Start');

    game.start();
}

function update(dt, tickcount) {
    // console.log(dt);    

    player.update(dt);

    camera.follow(dt, player);
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

    player.draw(ctx);

    // debug

    let center = new Vector(camera.pos.x + camera.width / 2, camera.pos.y + camera.height / 2);
    ctx.strokeStyle = "rgba(255,50,50,0.7)";
    ctx.strokeRect(center.x - camera.traceRange.x / 2, center.y - camera.traceRange.y / 2, camera.traceRange.x, camera.traceRange.y);

    let r = 40;
    let mousePos = camera.getMousePos(game.mousePos);
    drawString(ctx, mousePos.x + ", " + mousePos.y, mousePos.x, mousePos.y - 15, "#000", 10);

    ctx.restore();

    drawString(ctx, 'FPS : ' + game.loop.FPS().toFixed(3) + "", 0, 0, "#000", 10);


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


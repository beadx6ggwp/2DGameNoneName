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
        tilecolor: 'asset/tilecolor.png',
        coin: 'asset/coin.png',
        robin: 'asset/robin.png',
        swoosh: 'asset/swoosh.png'
    },
    sounds: {

    }
};
var player1Animation = {
    frameWidth: 17,
    frameHeight: 25,
    renderScale: 2,
    imgName: 'player',
    speed: 15,
    action: {
        'walk-up': '10,11,12,13,12,11,10,9,8,7,8,9',
        'walk-down': '3,4,5,6,5,4,3,2,1,0,1,2',
        'walk-left': '24,25,26,27,26,25,24,23,22,21,22,23',
        'walk-right': '17,18,19,20,19,18,17,16,15,14,15,16',
        'stand-up': '10',
        'stand-down': '3',
        'stand-left': '24',
        'stand-right': '17',
        'default': '3'
    }
};
var robinAnimation = {
    frameWidth: 1200 / 5,
    frameHeight: 1570 / 5,
    renderScale: 1 / 7,
    imgName: 'robin',
    speed: 15,
    repeat: true,
    action: {
        'default': '0-21'
    }
}
var coinAnimation = {
    frameWidth: 44,
    frameHeight: 40,
    renderScale: 1 / 2,
    imgName: 'coin',
    speed: 15,
    repeat: true,
    action: {
        'default': '0-9'
    }
}
var swordAnimation = {
    frameWidth: 128 / 4,
    frameHeight: 32,
    renderScale: 1.5,
    imgName: 'swoosh',
    speed: 25,
    repeat: false,
    action: {
        'default': '0-3'
    }
}


var game;
var camera
var asset;
var player;
var entities = [];

var debugMode = false;

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

    camera = new Camera(map);
    camera.width = gameConfig.width;
    camera.height = gameConfig.height;

    for (let index = 0; index < 100; index++) {
        let test = {
            pos: { x: randomInt(32, 1000), y: randomInt(32, 1000) },
            vel: { x: randomInt(-80, 80), y: randomInt(-80, 80) },
            collider: {
                x: -11, y: -10,
                w: 22, h: 20
            },
            bounceWithMap: true,
            world: map,
            animation: robinAnimation
        };
        entities.push(new Enemy1(test));
    }

    player = new Player({
        name: 'player',
        pos: { x: randomInt(32, 400), y: randomInt(32, 400) },
        vel: { x: 0, y: 0 },
        acc: { x: 0, y: 0 },
        moveSpeed: 200,
        collider: {
            x: -16, y: 0,
            w: 32, h: 24
        },
        bounceWithMap: true,
        world: map,
        animation: player1Animation
    });
    entities.push(player);

    main();
}

function main() {
    console.log('Start');

    game.start();
}

// dt: sec, 1/120 like 0.008333...
function update(dt, tickcount) {
    // console.log(dt);
    for (const entity of entities) {
        // if(entity.name =='atk')console.log(entity)
        entity.update(dt);
        // if (entity.animation.finish) {
        //     console.log('ani finish')
        // }
    }
    for (let i = entities.length - 1; i >= 0; i--) {
        const entity = entities[i];
        if (entity.name == 'player') continue;
        for (let j = entities.length - 1; j >= 0; j--) {
            const entity2 = entities[j];
            if (entity2.name == 'player') continue;
            if (entity.name == entity2.name) continue;
            if (rect2rect(entity.getCollisionBox(), entity2.getCollisionBox())) {
                entities.splice(j, 1);
                break;
            }
        }
    }

    for (let i = entities.length - 1; i >= 0; i--) {
        const entity = entities[i];
        if (entity.isDead) entities.splice(i, 1);
    }
    camera.follow(dt, player);
}


function draw(ctx, interp) {
    // clear
    ctx.fillStyle = ctx_backColor;
    ctx.fillRect(0, 0, game.width, game.height);
    ctx.save();
    // draw

    ctx.translate(-camera.pos.x, -camera.pos.y);

    drawMapWithCamera(ctx, map, camera);

    for (const entity of entities) {
        entity.draw(ctx);
    }

    ctx.restore();


    if (debugMode)
        showDebugInfo(ctx);
    // drawString(ctx, 'FPS : ' + game.loop.FPS().toFixed(3) + "", 0, 0, "#000", 10);
}

function showDebugInfo(ctx) {
    // debug
    ctx.save();
    ctx.translate(-camera.pos.x, -camera.pos.y);// 小卡

    let center = new Vector(camera.pos.x + camera.width / 2, camera.pos.y + camera.height / 2);
    ctx.strokeStyle = "rgba(255,0,0,1)";
    ctx.strokeRect(center.x - camera.traceRange.x / 2, center.y - camera.traceRange.y / 2, camera.traceRange.x, camera.traceRange.y);

    for (const entity of entities) {
        ctx.save();
        // start
        ctx.translate(entity.pos.x, entity.pos.y);

        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.strokeRect(-entity.renderWidth / 2, -entity.renderHeight / 2, entity.renderWidth, entity.renderHeight);

        let boxhalf = 2;
        ctx.fillStyle = "rgba(255,0,0,0.8)";
        ctx.fillRect(- boxhalf, - boxhalf, boxhalf * 2, boxhalf * 2);

        if (entity.colliderRef) {
            let c = entity.colliderRef;
            ctx.fillStyle = "rgba(255,255,127,0.5)";
            ctx.fillRect(c.pos.x, c.pos.y, c.w, c.h);
        }

        ctx.restore();
    }

    let r = 40;
    let mousePos = camera.getMousePos(game.mousePos);
    drawString(ctx, mousePos.x + ", " + mousePos.y, mousePos.x, mousePos.y - 15, "#000", 10);
    ctx.restore();

    drawString(ctx, 'FPS : ' + game.loop.FPS().toFixed(3) + "", 0, 0, "#000", 10);

}



//--------------------

window.addEventListener("keydown", (e) => {
    // console.log(e);
    if (e.keyCode == 84) {
        debugMode = !debugMode;
    }
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


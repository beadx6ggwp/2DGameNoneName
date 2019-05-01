var ctx_font = "Consolas",
    ctx_fontsize = 10,
    ctx_backColor = "rgb(109,194,202)";

//

var map;
var game;
var camera
var asset;
var player;
var entities = [];

var debugMode = false;

function preload() {
    console.log("PreLoad...");
    asset = new AssetLoader(assetSource, (obj, count, total) => {
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

    map = new TileMap(tilemap_data[nowMap]);

    camera = new Camera(map);
    camera.width = gameConfig.width;
    camera.height = gameConfig.height;

    for (let index = 0; index < 100; index++) {
        let test = {
            hp: 2,
            pos: { x: randomInt(32, 1000), y: randomInt(32, 1000) },
            vel: { x: randomInt(-80, 80), y: randomInt(-80, 80) },
            collider: {
                x: -11, y: -10,
                w: 22, h: 20
            },
            bounceToMap: true,
            world: map,
            animation: robinAnimation
        };
        entities.push(new Enemy1(test));
    }

    player = new Player({
        name: 'player',
        pos: { x: randomInt(200, 400), y: randomInt(200, 400) },
        vel: { x: 0, y: 0 },
        acc: { x: 0, y: 0 },
        moveSpeed: 200,
        collider: {
            x: -16, y: 0,
            w: 32, h: 24
        },
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
        entity.update(dt);
    }

    for (let i = entities.length - 1; i >= 0; i--) {
        let entity = entities[i];
        let had = entity.hitActionData;
        if (!had) continue;
        for (let j = entities.length - 1; j >= 0; j--) {
            let entity2 = entities[j];
            if (had.target.indexOf(entity2.name) != -1) {
                had.action(entity, entity2);
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

    // 所有物品繪製前都先 pos + (-camera.pos)，以camera起始座標為基準繪製
    // 假設camera(100, 0)、BoxA(10,0)、BoxB(120,0)
    // 那麼在攝影視角轉換的時候，相當於整個地圖往左移動100px，BoxA(-90, 0)、BoxB(20, 0)，所以畫面只看到BoxB
    // 要轉換回真實座標的話，只要加回去camera.pos即可
    ctx.translate(-camera.pos.x, -camera.pos.y);

    map.drawMapWithCamera(ctx, camera);
    // drawMapWithCamera(ctx, map, camera);

    for (const entity of entities) {
        entity.draw(ctx);
    }

    ctx.restore();


    if (debugMode)
        showDebugInfo(ctx);
}

function showDebugInfo(ctx) {
    // debug
    ctx.save();
    ctx.translate(-camera.pos.x, -camera.pos.y);

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

    let tw = map.tileWidth;
    let th = map.tileHeight;

    let start = {
        x: Math.max(0, Math.floor(camera.pos.x / tw)),
        y: Math.max(0, Math.floor(camera.pos.y / th))
    }
    let end = {
        x: Math.min(Math.floor((camera.pos.x + camera.width) / tw + 1), map.cols),
        y: Math.min(Math.floor((camera.pos.y + camera.height) / th + 1), map.rows)
    }
    for (let row = start.y; row < end.y; row++) {
        for (let col = start.x; col < end.x; col++) {
            let x = (col * tw);
            let y = (row * th);
            let layer = map.collision;
            let tile = map.getCollisionTile(row, col);
            if (tile == 0) continue;
            ctx.strokeStyle = "#000";
            ctx.strokeRect(x, y, tw, th);
        }
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


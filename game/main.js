var ctx_font = "Consolas",
    ctx_fontsize = 10,
    ctx_backColor = "#EEE";

var game;
var asset;
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
        speed: 15,
        frameWidth: 17,
        frameHeight: 25,
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
        speed: 10,
        frameWidth: 64,
        frameHeight: 64,
        imgName: 'player2',
        action: {
            up: '0-8',
            down: '9-17',
            left: '18-26',
            right: '27-35',
            stand: '18'
        }
    }
}

var player;

class Player {
    constructor(ani_config) {
        this.pos = { x: 0, y: 0 };
        this.vel = { x: 0, y: 0 };
        this.speed = 100;

        this.ismove = false;
        this.facing = 'down';
        this.action = 'stand-down';

        this.ani = ani_config;
        let s = ani_config;
        this.sheet = new SpriteSheet(asset.imgs[s.imgName], s.frameWidth, s.frameHeight);
        this.animation = new Animation(this.sheet, s.speed, s.action[this.action]);
    }
    update(dt) {
        let keys = game.keys;
        let vel = this.vel;
        let pos = this.pos;
        let speed = this.speed;

        this.ismove = false;

        if (keys['38']) {
            vel.y = -speed;
            this.facing = 'up';
        }
        else if (keys['40']) {
            vel.y = speed;
            this.facing = 'down';
        }
        else {
            vel.y = 0;
        }
        if (keys['37'] || keys['38'] || keys['39'] || keys['40']) {
            this.ismove = true;
        }

        if (keys['37']) {
            vel.x = -speed;
            this.facing = 'left';
        }
        else if (keys['39']) {
            vel.x = speed;
            this.facing = 'right';
        }
        else {
            vel.x = 0;
        }
        pos.x += dt * vel.x;
        pos.y += dt * vel.y;


        this.action = `${this.ismove ? 'walk' : 'stand'}-${this.facing}`;
        this.animation.setStartEnd(this.ani.action[this.action])

        this.animation.update();
    }
    draw(ctx) {
        this.animation.draw(ctx, this.pos.x, this.pos.y, 34, 50);
    }
}

function preload() {
    console.log("PreLoad...");

    var assetCallback = (obj, count, total) => {
        console.log(`loaded: ${count}/${total}`)
        if (count >= total)
            init()
    }

    asset = new assetLoader(assetSource, assetCallback);

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


function update(dt, tickcount) {
    // console.log(dt);    

    player.update(dt);
}


function draw(ctx, interp) {
    // clear
    ctx.fillStyle = ctx_backColor;
    ctx.fillRect(0, 0, game.width, game.height);

    // draw

    var pImg = asset.imgs.player;
    ctx.drawImage(pImg, 0, 200, pImg.width, pImg.height);

    player.draw(ctx);

    // debug
    let r = 40;
    let mousePos = game.mousePos;
    drawString(ctx, mousePos.x + ", " + mousePos.y, mousePos.x, mousePos.y - 15, "#000", 10);

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
    if (game) game.loop.pause()
}

window.onfocus = function () {
    if (game) game.loop.pause()
}


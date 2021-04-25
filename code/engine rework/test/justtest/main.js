
var canvas, ctx;

var x = 0;
var game, sc;
var w = 800, h = 600;

window.onload = function () {
    game = new Game();
    game.addListener(new AppEventListener({
        afterRender: function () {
            var debugInfo = [
                `predictFrame:${FrameState.predictFrame.toFixed(3)}`,
                `currFrame:${FrameState.currFrame}`,
                `tickCount:${FrameState.tickCount}`
            ]
            document.getElementById('p1').innerHTML = debugInfo.join('<br>');
        }
    }))

    game.sceneManager.createScene([{ name: 'sc3', x: 200, y: 200, color: '#FF7' }]);
    game.sceneManager.createScene([{ name: 'sc2', x: 150, y: 150, color: '#F77' }]);
    sc = game.sceneManager.createScene([{ name: 'sc1', x: 100, y: 100 }]);

    sc.setBGImg('https://i.imgur.com/2ucWbfe.jpg', 0);
    initRenderObj(sc);

    ResManager.loadResConfig('res/json/res.json',
        (loadedCount, totalCount, currLoadObj) => {
            console.log(`${loadedCount}/${totalCount}`, currLoadObj)
        },
        (m) => {
            console.log('OK');
        }
    );


    game.run();
}

function initRenderObj(sc) {
    for (let i = 0; i < 20; i++) {
        var obj = sc.createRObj(Ball.ClassName);
        obj.setPos(randomInt(20, 380), randomInt(20, 380));
        obj.setVel(randomInt(100, 300), randomInt(100, 300));
        // obj.setPos(0, randomInt(20, 380));
        // obj.setVel(100, randomInt(100, 300));
        obj.color = `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
    }
}

class Ball extends RenderObj {
    constructor(config, radius) {
        super(config);
        this.r = radius || 10;
        this.color = '#FFF';
    }

    update(dt) {
        var w = this.owner.w;
        var h = this.owner.h;
        // debugger

        if (this.pos.x - this.r < 0 && this.vel.x < 0 || this.pos.x + this.r > w && this.vel.x > 0)
            this.vel.x *= -1;
        if (this.pos.y - this.r < 0 && this.vel.y < 0 || this.pos.y + this.r > h && this.vel.y > 0)
            this.vel.y *= -1;

        super.update(dt);
    }

    render(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.strokeStyle = '#FFF';
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2);
        ctx.stroke();
    }
}
Ball.ClassName = 'Ball';
ClassFactory.regClass(Ball.ClassName, Ball);


window.onblur = function () {
    if (game) game.stop()
}

window.onfocus = function () {
    if (game) game.run()
}

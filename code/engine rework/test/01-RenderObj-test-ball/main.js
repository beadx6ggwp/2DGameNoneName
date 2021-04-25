
var canvas, ctx;

var game;
var w = 800, h = 600;

window.onload = function () {
    game = new Game();

    sc = game.sceneManager.createScene([{ name: 'sc1', x: 100, y: 100, w: w, h: h }]);

    sc.setBGImg('https://i.imgur.com/2ucWbfe.jpg', 0);
    initRenderObj(sc);

    game.addListener(new AppEventListener({
        afterRender: function () {
            document.getElementById('p1').textContent = `predictFrame:${FrameState.predictFrame.toFixed(3)}, currFrame:${FrameState.currFrame}`;
        }
    }))

    game.run();
}

function initRenderObj(sc) {
    for (let i = 0; i < 20; i++) {
        var obj = sc.createRObj(Ball.ClassName);
        obj.setPos(randomInt(20, 380), randomInt(20, 380));
        obj.setVel(randomInt(100, 300), randomInt(100, 300));
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

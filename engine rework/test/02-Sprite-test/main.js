
var canvas, ctx;

var x = 0;
var game, sc;
var w = 800, h = 600;

window.onload = function () {
    game = new Game();

    sc = game.sceneManager.createScene([{ name: 'sc1', x: 100, y: 100 }]);

    game.addListener(new AppEventListener({
        afterRender: function () {
            var debugInfo = [
                `predictFrame:${FrameState.predictFrame.toFixed(3)}`,
                `currFrame:${FrameState.currFrame}`
            ]
            document.getElementById('p1').innerHTML = debugInfo.join('<br>');
        }
    }))

    sc.setBGImg('https://i.imgur.com/2ucWbfe.jpg', 0);
    initRenderObj(sc);

    game.run();
}

function initRenderObj(sc) {
    let img = document.getElementById('mr');
    let runFrames = new Frames('m_run', img);
    let w = 32, h = 32;
    for (let i = 0; i < 3; i++) {
        runFrames.add(i * w, 0, w, h, img, 200);
    }

    let animGroup = new AnimationGroup();
    animGroup.add('run', runFrames);

    for (let i = 0; i < 10; i++) {
        let mr = sc.createRObj(Mario.ClassName, [{ name: 'mr' }]);
        mr.setPos(randomInt(20, 380), randomInt(20, 380));
        let sp = 100;
        let rand = random(0, 3);
        mr.setVel(rand * sp, 0);
        mr.setAnimationGroup(animGroup, 'run');
        mr.animation.speed = rand;
        mr.rw = 64;
        mr.rh = 64;
    }
}

class Mario extends Sprite {
    constructor(config) {
        super(config);
    }

    update(dt) {
        var w = this.scene.w;
        var h = this.scene.h;
        // debugger

        if (this.pos.x < 0 && this.vel.x < 0 || this.pos.x > w && this.vel.x > 0) {
            this.vel.x *= -1;
            this.isXflip = this.vel.x < 0;
        }
        if (this.pos.y < 0 && this.vel.y < 0 || this.pos.y > h && this.vel.y > 0) {
            this.vel.y *= -1;
        }

        super.update(dt);
    }
}
Mario.ClassName = 'Mario';
ClassFactory.regClass(Mario.ClassName, Mario);


window.onblur = function () {
    if (game) game.stop()
}

window.onfocus = function () {
    if (game) game.run()
}

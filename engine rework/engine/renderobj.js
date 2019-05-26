class RenderObj {
    constructor(config) {
        config = config || {};
        this.name = GetValue(config, 'name', `RenderObj_${RenderObj.SID++}`);
        this.scene = GetValue(config, 'scene', null);

        let _pos = GetValue(config, 'pos', new Vector());
        this.pos = new Vector(_pos.x, _pos.y);

        let _vel = GetValue(config, 'vel', new Vector());
        this.vel = new Vector(_vel.x, _vel.y);

        let _acc = GetValue(config, 'acc', new Vector());
        this.acc = new Vector(_acc.x, _acc.y);

        // render width/height
        this.rw = 0;
        this.rh = 0;

        this.rotation = GetValue(config, 'rotation', 0);
        this.zindex = GetValue(config, 'zindex', 0);

        this.visible = true;
        this.canRemove = false;

        // ActionEvents
        this.actions = [];

        this.drawBase = GetValue(config, 'drawBase', false);
        this.defaultSize = GetValue(config, 'defaultSize', 30);
        this.defaultColor = GetValue(config, 'defaultColor', 'rgba(255,127,127,0.5)');
    }

    setPos(x, y) {
        this.pos.x = x;
        this.pos.y = y;
    }
    setVel(x, y) {
        this.vel.x = x;
        this.vel.y = y;
    }
    setAcc(x, y) {
        this.acc.x = x;
        this.acc.y = y;
    }
    setRotation(rad) {
        this.rotation = rad || this.rotation;
    }
    move(xOff, yOff) {
        this.pox.x += xOff;
        this.pos.y += yOff;
    }
    moveStep(dt) {
        this.vel.x += this.acc.x * dt;
        this.vel.y += this.acc.y * dt;
        this.pos.x += this.vel.x * dt;
        this.pos.y += this.vel.y * dt;
    }

    update(dt, tick) {
        this.moveStep(dt);
    }

    render(ctx) {
        if (this.drawBase) {
            this.drawDefault(ctx);
        }
    }

    drawDefault(ctx) {
        ctx.fillStyle = this.defaultColor;
        var defW = this.rw || this.defaultSize;
        var defH = this.rh || this.defaultSize;
        ctx.fillRect(-defW / 2, -defH / 2, defW, defH);
    }
}
RenderObj.SID = 0;
RenderObj.ClassName = 'RenderObj';
ClassFactory.regClass(RenderObj.ClassName, RenderObj);
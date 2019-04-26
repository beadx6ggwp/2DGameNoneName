class Player {
    constructor(config) {
        this.conf = config;
        // centerPos
        this.pos = new Vector(config.pos.x, config.pos.y);
        this.vel = new Vector();

        this.speed = 200;

        // colliderRef碰撞體相對於中心的位置，collider實際進行檢測
        this.colliderRef = new Box(config.collider || {});

        this.state = 'move';
        this.ismove = false;
        this.facing = 'down';
        this.action = 'stand-down';
        this.lastDir = new Vector();

        let image = asset.imgs[config.imgName];
        this.sheet = new SpriteSheet(image, config.frameWidth, config.frameHeight);
        this.animation = new Animation(this.sheet, config.speed, config.action[this.action]);

        this.renderScale = config.renderScale;
        this.renderWidth = config.frameWidth * config.renderScale;
        this.renderHeight = config.frameHeight * config.renderScale;
    }
    update(dt) {
        let Alarm = game.Alarm;
        let keys = game.keys;
        let speed = this.speed;
        // input
        let inputDir = new Vector();
        if (keys['38']) inputDir.y = -1;
        if (keys['40']) inputDir.y = 1;
        if (keys['37']) inputDir.x = -1;
        if (keys['39']) inputDir.x = 1;

        // console.log(Alarm.check('roleCoolDown'))
        if (keys['32'] && Alarm.check('roleCoolDown') == 0) {
            this.state = 'role';

            let sec = 0.1;
            Alarm.setTime('roleTime', sec * 1000);
            // this.vel.x = 200 / sec;
            this.vel = this.lastDir.clone().norm().setLength(120 / sec);
        }

        if (keys['90'] && Alarm.check('attackCoolDown') == 0) {
            this.state = 'attack';

            Alarm.setTime('attack', 0.2 * 1000);
            this.vel.multiplyScalar(0);
            this.ismove = false;
        }

        switch (this.state) {
            case 'move':
                if (keys['38']) {
                    this.facing = 'up';
                }
                else if (keys['40']) {
                    this.facing = 'down';
                }
                if (keys['37']) {
                    this.facing = 'left';
                }
                else if (keys['39']) {
                    this.facing = 'right';
                }

                // 處理移動，並使每個8方向速度一致
                if (inputDir.x != 0 || inputDir.y != 0) {
                    this.ismove = true;
                    this.lastDir = inputDir.clone();
                    this.vel = inputDir.norm().setLength(speed);
                } else {
                    this.ismove = false;
                    this.vel.multiplyScalar(0);
                }
                break;
            case 'role':
                if (Alarm.check('roleTime') >= 0) {
                    Alarm.setTime('roleCoolDown', 0.5 * 1000);
                    this.vel.multiplyScalar(0);
                    this.state = 'move';
                }
                break;
            case 'attack':
                console.log('now is attack');

                if (Alarm.check('attack') >= 0) {
                    Alarm.setTime('attackCoolDown', 0.2 * 1000);
                    this.state = 'move';
                }
                break;
        }
        this.pos.add(this.vel.clone().multiplyScalar(dt));

        boxCollisionResponseToMap(this, map);

        // update anime
        this.action = `${this.ismove ? 'walk' : 'stand'}-${this.facing}`;
        this.animation.setStartEnd(this.conf.action[this.action])

        this.animation.update();

    }
    draw(ctx) {
        ctx.save();
        // start
        ctx.translate(this.pos.x, this.pos.y);
        this.animation.draw(ctx, -this.renderWidth / 2, -this.renderHeight / 2, this.renderWidth, this.renderHeight);

        // debug
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.strokeRect(-this.renderWidth / 2, -this.renderHeight / 2, this.renderWidth, this.renderHeight);

        let boxhalf = 2;
        ctx.fillStyle = "rgba(255,0,0,0.8)";
        ctx.fillRect(- boxhalf, - boxhalf, boxhalf * 2, boxhalf * 2);

        let c = this.colliderRef;
        ctx.fillStyle = "rgba(255,255,127,0.5)";
        ctx.fillRect(c.pos.x, c.pos.y, c.w, c.h);

        if (this.state == 'attack') {
            let atkSize = { w: 30, h: 30 };
            let offset = { x: 0, y: this.renderHeight / 4 };
            ctx.fillStyle = "rgba(255,50,50,0.7)";
            let dir = this.lastDir.clone().norm();
            ctx.fillRect(-atkSize.w / 2 + dir.x * 32 + offset.x, -atkSize.h / 2 + dir.y * 25 + offset.y, atkSize.w, atkSize.h);
            // console.log(this.lastDir)
        }
        // end
        ctx.restore();
    }

    getCollisionBox() {
        // 更新碰撞盒位置
        let collider = this.colliderRef.clone();
        collider.pos.add(this.pos);
        return collider;
    }
}
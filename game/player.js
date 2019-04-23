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

        let image = asset.imgs[config.imgName];
        this.sheet = new SpriteSheet(image, config.frameWidth, config.frameHeight);
        this.animation = new Animation(this.sheet, config.speed, config.action[this.action]);

        this.renderScale = config.renderScale;
        this.renderWidth = config.frameWidth * config.renderScale;
        this.renderHeight = config.frameHeight * config.renderScale;
    }
    update(dt) {
        let keys = game.keys;
        let speed = this.speed;
        // input
        let inputDir = new Vector();
        if (keys['38']) inputDir.y = -1;
        if (keys['40']) inputDir.y = 1;
        if (keys['37']) inputDir.x = -1;
        if (keys['39']) inputDir.x = 1;

        if (this.state == 'move') {
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
                this.vel = inputDir.norm().setLength(speed);
            } else {
                this.ismove = false;
                this.vel.multiplyScalar(0);
            }
        }

        this.pos.add(this.vel.clone().multiplyScalar(dt));

        boxCollisionResponseToMap(player, map);

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
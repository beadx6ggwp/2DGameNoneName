class Player {
    constructor(config) {
        this.conf = config;
        // centerPos
        this.pos = new Vector(config.pos.x, config.pos.y);
        this.vel = new Vector();

        this.speed = 200;

        // colliderRef碰撞體相對於中心的位置，collider實際進行檢測
        this.colliderRef = new Box(config.collider || {}, 2);
        this.collider = new Box(config.collider, 2);

        this.status = 'stand';
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
        let inputDir = new Vector();

        // input
        if (keys['38']) {
            inputDir.y = -1;
            this.facing = 'up';
        }
        else if (keys['40']) {
            inputDir.y = 1;
            this.facing = 'down';
        }
        if (keys['37']) {
            inputDir.x = -1;
            this.facing = 'left';
        }
        else if (keys['39']) {
            inputDir.x = 1;
            this.facing = 'right';
        }

        // 處理移動，並使每個8方向速度一致
        if (inputDir.x != 0 || inputDir.y != 0) {
            this.status = 'move';
            this.ismove = true;
            this.vel = inputDir.norm().setLength(speed);
        } else {
            this.status = 'stand';
            this.ismove = false;
            this.vel.multiplyScalar(0);
        }

        this.pos.add(this.vel.clone().multiplyScalar(dt));



        let collider = this.getCollisionBox();
        let checkPoint = [
            new Vector(collider.pos.x, collider.pos.y),
            new Vector(collider.pos.x + collider.w, collider.pos.y),
            new Vector(collider.pos.x, collider.pos.y + collider.h),
            new Vector(collider.pos.x + collider.w, collider.pos.y + collider.h)
        ];
        for (const p of checkPoint) {
            let col = ~~(p.x / map.tileWidth);
            let row = ~~(p.y / map.tileHeight);
            let tileType = getTileTypeFromPos(map, row, col);
            if (tileType == 3) continue;
            let checkObj = new Box(col * map.tileWidth, row * map.tileHeight, map.tileWidth, map.tileHeight);
            var result = rectCollisionResponse(checkObj, collider);
            if (result.touch) {
                // this.pos.x += result.MTV.x;
                // this.pos.y += result.MTV.y;
            }
        }

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
        let collider = this.collider.clone();
        collider.pos.add(this.pos);
        return collider;
    }
}
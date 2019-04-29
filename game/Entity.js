/*
    config example:
    {
        pos: { x: 0, y: 0 },
        vel: { x: 0, y: 0 },
        collider: {
            x: -15, y: -15,
            w: 30, h: 30
        },
        bounceWithMap: true,
        world: Worldmap(tilemap),
        animation: {
            frameWidth: 44,
            frameHeight: 40,
            renderScale: 1 / 2,
            imgName: 'coin',
            speed: 15,
            action: {
                'default': '0-9'
            }
        }
    }
 */
class Entity {
    constructor(config) {
        // 目前暫指map
        this.config = config;//直接等於可能會有座標速率被修改的問題，但複製的話感覺太浪費記憶體
        this.world = GetValue(config, 'world', null);

        this.name = GetValue(config, 'name', 'defaultEntity');

        this.pos = GetValue(config, 'pos', new Vector());
        this.pos = new Vector(this.pos.x, this.pos.y);

        this.acc = GetValue(config, 'acc', new Vector());
        this.acc = new Vector(this.acc.x, this.acc.y);

        this.vel = GetValue(config, 'vel', new Vector());
        this.vel = new Vector(this.vel.x, this.vel.y);

        this.survivalMode = GetValue(config, 'survivalMode', false);
        this.survivalTime = GetValue(config, 'survivalTime', -1);

        this.collisionToMap = GetValue(config, 'collisionToMap', true);
        this.bounceToMap = GetValue(config, 'bounceToMap', false);

        /*
        {parent:Entity,target:['name',...],action:function(ent1,ent2){}}
        */
        this.hitActionData = GetValue(config, 'hitActionData', null);
        this.colliderRef = GetValue(config, 'collider', null);
        if (this.colliderRef != null)
            this.colliderRef = new Box(this.colliderRef);

        this.aniData = GetValue(config, 'animation', null);
        if (this.aniData != null) {
            let ani = this.aniData;
            this.rotate = GetValue(ani, 'rotate', 0);
            this.scaleX = GetValue(ani, 'scaleX', 1);
            this.scaleY = GetValue(ani, 'scaleY', 1);
            this.renderScale = ani.renderScale;
            this.renderWidth = ani.frameWidth * ani.renderScale;
            this.renderHeight = ani.frameHeight * ani.renderScale;
            // console.log(ani)
            let image = asset.imgs[ani.imgName];
            this.sheet = new SpriteSheet(image, ani.frameWidth, ani.frameHeight);
            this.animation = new Animation(this.sheet, ani.speed, ani.action['default'], ani.repeat);
        }
        this.drawBase = false;


        // need to delect
        this.isDead = false;
    }

    update(dt, tick) {
        this.vel.add(this.acc);
        this.pos.add(this.vel.clone().multiplyScalar(dt));

        if (this.collisionToMap && this.colliderRef != null && this.world != null) {
            boxCollisionResponseToMap(this, this.world, this.bounceToMap);
        }

        if (this.animation) {
            this.animation.update(dt);
        }

        if (this.survivalMode) {
            this.survivalTime -= dt
            if (this.survivalTime < 0) {
                this.isDead = true;
            }
        }
    }

    draw(ctx, interp) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.rotate * Math.PI / 180);
        ctx.scale(this.scaleX, this.scaleY);

        if (this.animation) {
            // if(this.vel.x > 0) ctx.scale(-1,1);
            this.animation.draw(ctx, -this.renderWidth / 2, -this.renderHeight / 2, this.renderWidth, this.renderHeight);
        } else if (this.drawBase) {
            let size = 30;
            ctx.fillStyle = "rgba(255,127,127,0.5)";
            ctx.fillRect(-size / 2, -size / 2, size, size);
        }
        ctx.restore();
    }

    getCollisionBox() {
        // 更新碰撞盒位置
        if (!this.colliderRef) return null;
        let collider = this.colliderRef.clone();
        collider.pos.add(this.pos);
        return collider;
    }
}
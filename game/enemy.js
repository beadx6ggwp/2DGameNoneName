class Enemy1 extends Entity {
    constructor(config) {
        super(config);
        this.name = 'enemy1';
        this.hp = GetValue(config, 'hp', 1);
        this.hitCD = 500;
        this.hitCountDown = 0;
    }

    update(dt) {
        // console.log(this.hitCountDown, dt);
        if (this.hitCountDown > 0) this.hitCountDown -= dt * 1000;

        if (this.hp <= 0) {
            this.isDead = true;
            createParticles(this.pos.x, this.pos.y, 50);
        }
        super.update(dt);
    }
    draw(ctx) {
        ctx.save();
        this.vel.x > 0 ? this.scaleX = -1 : this.scaleX = 1;

        super.draw(ctx);
        if (this.hitCountDown > 0) {
            // let box = this.getCollisionBox();
            // ctx.fillStyle = `rgba(255,255,255,${random(0, 0.5)})`;
            // ctx.fillRect(box.pos.x, box.pos.y, box.w, box.h)
        }
        ctx.restore();
    }
    hit(dmg) {
        if (this.hitCountDown <= 0) {
            this.hp -= dmg
            this.hitCountDown = this.hitCD;
        }
    }
}
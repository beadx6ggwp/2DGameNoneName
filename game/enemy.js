class Enemy1 extends Entity {
    constructor(config) {
        super(config);
    }

    update(dt) {
        super.update(dt);
    }
    draw(ctx) {
        ctx.save();
        this.vel.x > 0 ? this.scaleX = -1 : this.scaleX = 1;

        super.draw(ctx);
        ctx.restore();
    }
}
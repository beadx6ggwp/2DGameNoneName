class Ball extends Sprite {
    constructor(config) {
        config = config || {};
        super(config);

        this.r = GetValue(config, 'r', 10);
        this.rw = this.rh = this.r * 2;

        this.actions.push(new ActionEvent('ballToBlockCollide', this, ['block', 'stick'],
            function (sender, target) {
                let ball = sender, block = target;
                if (rect2rect(ball, block)) {
                    if (target.name == 'block') {
                        ball.vel.y *= -1;
                        ++block.hit;
                        block.canRemove = true;
                    }
                    if (target.name == 'stick') {
                        ball.vel.y *= -1;
                    }
                }
            }));
    }
    update(dt) {
        let w = this.scene.w,
            h = this.scene.h;
        if (this.pos.x - this.r < 0 && this.vel.x < 0 ||
            this.pos.x + this.r > w && this.vel.x > 0) {
            this.vel.x *= -1;
        }
        if (this.pos.y - this.r < 0 && this.vel.y < 0 ||
            this.pos.y + this.r > h && this.vel.y > 0) {
            this.vel.y *= -1;
        }

        super.update(dt);
    }
}
Ball.SID = 0;
Ball.ClassName = 'Ball';
ClassFactory.regClass(Ball.ClassName, Ball);
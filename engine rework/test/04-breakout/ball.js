class Ball extends Sprite {
    constructor(config) {
        config = config || {};
        super(config);

        this.r = GetValue(config, 'r', 10);
        this.rw = this.rh = this.r * 2;

        this.actions.push(new ActionEvent('ballToBlockCollide', this, ['block', 'stick'],
            function (sender, target) {
                let ball = sender;

                if (target.name == 'block' && rect2rect(sender, target)) {
                    let block = target;
                    ball.vel.y *= -1;
                    if (block.toHit()) {
                        cfg.score += block.lev * 10;
                        cfg.blockNum--;
                        block.canRemove = true;
                    }
                    console.log(block.hit, block.lev);
                }
                if (target.name == 'stick') {
                    let stick = target;
                    if (rect2rect(sender, target)) {
                        ball.vel.y *= -1;
                    }
                    else {
                        if (ball.pos.y + ball.r > stick.pos.y) {
                            cfg.life--;
                            resetGame();
                        }
                    }
                }
            }));
    }
    update(dt) {
        let w = this.owner.w,
            h = this.owner.h;

        if (state == 0) resetBall();

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
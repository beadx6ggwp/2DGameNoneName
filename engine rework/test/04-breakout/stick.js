class Stick extends Sprite {
    constructor(config) {
        super(config);
    }
    update(dt) {
        let w = this.scene.w, hw = this.rw / 2;
        let sp = 200;
        this.setVel(0, 0);
        if (Key.pressed('LEFT')) {
            if (this.pos.x > hw) {
                this.setVel(-sp, 0);
            }
        }
        if (Key.pressed('RIGHT')) {
            if (this.pos.x + hw < w) {
                this.setVel(sp, 0);
            }
        }
        if (Key.pressed('SPACE')) {
            launchBall();
        }
        super.update(dt);
    }
}
Stick.SID = 0;
Stick.ClassName = 'Stick';
ClassFactory.regClass(Stick.ClassName, Stick);
class Player extends Entity {
    constructor(config) {
        super(config);

        this.state = 'move';
        this.ismove = false;
        this.facing = 'down';
        this.action = 'stand-down';
        this.lastDir = new Vector();

        this.moveSpeed = GetValue(config, 'moveSpeed', 10);
    }

    update(dt) {
        let Alarm = game.Alarm;
        let keys = game.keys;
        let moveSpeed = this.moveSpeed;
        // input
        let inputDir = new Vector();
        if (keys['38']) inputDir.y = -1;
        if (keys['40']) inputDir.y = 1;
        if (keys['37']) inputDir.x = -1;
        if (keys['39']) inputDir.x = 1;

        // console.log(Alarm.check('roleCoolDown'))
        if (keys['32'] && Alarm.check('roleCoolDown') == null) {
            this.state = 'role';

            let sec = 0.1;
            Alarm.setTime('roleTime', sec * 1000);
            // this.vel.x = 200 / sec;
            this.vel = this.lastDir.clone().norm().setLength(100 / sec);
        }

        // if(按下 && 攻擊CD到了 && 現在還沒攻擊)
        if (keys['90'] && Alarm.check('attackCoolDown') == null && Alarm.check('attack') == null) {
            this.state = 'attack';

            let dir = this.lastDir.clone().norm();
            let mycollider = this.colliderRef;
            let scale = swordAnimation.renderScale;
            let collider = {
                x: -15 * scale, y: -15 * scale,
                w: 30 * scale, h: 30 * scale
            };
            let atkConfig = {
                name: 'player_atk',
                pos: {
                    x: this.pos.x + dir.x * mycollider.w,
                    y: this.pos.y + dir.y * (collider.h / 2 + (dir.y > 0 && dir.y != 0 ? 5 : -5)) * (1 - Math.abs(dir.x)) //1-dir.x 防止斜者打
                },
                survivalMode: true,
                collider: collider,
                collisionToMap: false,
                bounceWithMap: false,
                world: map,
                animation: swordAnimation
            };

            atkConfig.animation.scaleX = Math.sign(dir.x) || 1;
            atkConfig.animation.rotate = 0;
            if (dir.y != 0 && dir.x == 0) {
                atkConfig.animation.rotate = dir.y > 0 ? 90 : -90;
            }
            let atkObj = new Entity(atkConfig);
            atkObj.survivalTime = atkObj.animation.animationSequence.length * atkObj.animation.frameSleep / 1000;
            entities.push(atkObj);

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
                    // debugger
                    this.ismove = true;
                    this.lastDir = inputDir.clone();
                    this.vel = inputDir.norm().setLength(moveSpeed);
                } else {
                    this.ismove = false;
                    this.vel.multiplyScalar(0);
                }

                this.action = `${this.ismove ? 'walk' : 'stand'}-${this.facing}`;
                this.animation.setStartEnd(this.aniData.action[this.action])
                break;
            case 'role':
                if (Alarm.check('roleTime') >= 0) {
                    Alarm.setTime('roleCoolDown', 0.5 * 1000);
                    this.vel.multiplyScalar(0);
                    this.state = 'move';
                }
                break;
            case 'attack':
                // console.log('now is attack');

                if (Alarm.check('attack') >= 0) {
                    Alarm.setTime('attackCoolDown', 0.3 * 1000);
                    this.state = 'move';
                }
                break;
        }

        super.update(dt);
    }
    draw(ctx) {
        ctx.save();
        // start
        ctx.translate(this.pos.x, this.pos.y);

        // if (this.state == 'attack') {
        //     let atkSize = { w: 30, h: 30 };
        //     let offset = { x: 0, y: this.renderHeight / 4 };
        //     ctx.fillStyle = "rgba(255,50,50,0.7)";
        //     let dir = this.lastDir.clone().norm();
        //     ctx.fillRect(-atkSize.w / 2 + dir.x * 32 + offset.x, -atkSize.h / 2 + dir.y * 25 + offset.y, atkSize.w, atkSize.h);
        //     // console.log(this.lastDir)
        // }
        ctx.restore();

        super.draw(ctx);
    }
}
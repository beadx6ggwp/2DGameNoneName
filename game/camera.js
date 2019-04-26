class Camera {
    constructor(world) {
        this.world = world;
        this.width = 800;
        this.height = 600;

        this.traceRange = new Vector(400, 300);
        this.traceSpeed = 300;
        this.pos = new Vector();// leftTop
    }
    follow(dt, gameObj) {
        let world = this.world;
        // this.pos.x = gameObj.pos.x - this.width / 2;
        // this.pos.y = gameObj.pos.y - this.height / 2;

        let traceRange = this.traceRange;
        let center = new Vector(this.pos.x + this.width / 2, this.pos.y + this.height / 2);
        let traceRangeBox = new Box(center.x - traceRange.x / 2, center.y - traceRange.y / 2,
            traceRange.x, traceRange.y);

        let speed = gameObj.speed * 1.2 * dt;
        // 問題:當跟隨速度 > gameObj的移動速度時，會出現超前狀態，導致抖動
        // 解:當p到edge的距離 < 下次移動距離，直接讓邊移動到 p上
        // 先用ray cast求得移動前 center -> p 在邊上的交點 p'
        // 在求向量 a = p'-p，接者讓center + a向量，即可讓邊完美移動到指定的P點
        // need ray cast
        // if (!point2rect(gameObj.pos, traceRangeBox)) {
        //     let dist = gameObj.pos.clone().subtract(center);
        //     this.pos.add(dist.setLength(speed));
        // }

        // 暫時解法:當要超前時，直接貼上
        let dist = gameObj.pos.x - (center.x + traceRange.x / 2);
        if (dist > 0) {
            if (dist < speed) {
                this.pos.x += dist;
            } else {
                this.pos.x += speed;
            }
        }
        dist = (center.x - traceRange.x / 2) - gameObj.pos.x;
        if (dist > 0) {
            if (dist < speed) {
                this.pos.x -= dist;
            } else {
                this.pos.x -= speed;
            }
        }

        dist = gameObj.pos.y - (center.y + traceRange.y / 2);
        if (dist > 0) {
            if (dist < speed) {
                this.pos.y += dist;
            } else {
                this.pos.y += speed;
            }
        }
        dist = (center.y - traceRange.y / 2) - gameObj.pos.y;
        if (dist > 0) {
            if (dist < speed) {
                this.pos.y -= dist;
            } else {
                this.pos.y -= speed;
            }
        }

        // limit min and max
        let maxW = world.cols * world.tileWidth;
        let maxH = world.rows * world.tileHeight;
        if (this.pos.x < 0) this.pos.x = 0;
        if (this.pos.y < 0) this.pos.y = 0;
        if (this.pos.x + this.width > maxW) this.pos.x = maxW - this.width;
        if (this.pos.y + this.height > maxH) this.pos.y = maxH - this.height;
    }
    getMousePos(gameMouse) {
        // 問題:當ctx.scale假設要縮放1024x768，這時滑鼠位置會有偏移
        return {
            x: Math.floor(this.pos.x + gameMouse.x),
            y: Math.floor(this.pos.y + gameMouse.y)
        }
    }
}
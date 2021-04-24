class Sprite extends RenderObj {
    constructor(config) {
        super(config)

        this.anims = null;
        this.animation = new Animation();

        // 是否水平垂直反向
        this.isXflip = false;
        this.isYflip = false;

        // 水平垂直縮放係數
        this.scaleX = 1;
        this.scaleY = 1;
    }

    setAnims(anims, currAnimName) {
        this.anims = anims;
        this.animation.setAnims(anims, currAnimName);
    }

    update(dt) {
        super.update(dt);
    }
    render(ctx) {
        ctx.translate(this.pos.x, this.pos.y);

        let scaleX = (this.isXflip) ? -this.scaleX : this.scaleX;
        let scaleY = (this.isYflip) ? -this.scaleY : this.scaleY;

        if (this.rotation !== 0) ctx.rotate(this.rotation * Math.PI / 180);
        ctx.scale(scaleX, scaleY);

        if (this.animation.getCurrFrames() == null) {
            this.drawDefault(ctx);
            return
        }
        let frame = this.animation.getNextFrames();
        // ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        ctx.drawImage(frame.img, frame.x, frame.y, frame.w, frame.h,
            -this.rw / 2, -this.rh / 2, this.rw, this.rh)
    }
}
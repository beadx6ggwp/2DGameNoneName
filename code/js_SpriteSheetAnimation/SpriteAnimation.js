function SpriteSheet(imgPath, frameWidth, frameHeight) {
    this.image = new Image();
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;

    // calculate the number of frames in a row after the image loads
    let self_ = this;
    this.image.onload = function (e) {
        self_.framesPerRow = Math.floor(self_.image.width / self_.frameWidth);
        console.log("onload:" + imgPath);
    };

    this.image.src = imgPath;
}

function Animation(spriteSheet, frameSpeedPerSecond, startFrame, endFrame) {
    this.spriteSheet = spriteSheet;

    this.animationSequence = [];
    this.currentFrame = 0;

    this.frameSleep = 1000 / frameSpeedPerSecond;
    this.lastTime = new Date().getTime();

    for (let index = startFrame; index <= endFrame; index++)
        this.animationSequence.push(index);
}
Animation.prototype.update = function () {
    if (new Date().getTime() - this.lastTime > this.frameSleep) {
        this.currentFrame = (this.currentFrame + 1) % this.animationSequence.length;
        this.lastTime = new Date().getTime();
    }
}
Animation.prototype.draw = function (ctx, x, y, width, height) {
    let index = this.animationSequence[this.currentFrame];
    let framesPerRow = this.spriteSheet.framesPerRow;

    let col = Math.floor(index % framesPerRow);
    let row = Math.floor(index / framesPerRow);

    let sw = this.spriteSheet.frameWidth,
        sh = this.spriteSheet.frameHeight;
    let sx = col * sw,
        sy = row * sh;

    let dw = width ? width : sw,
        dh = height ? height : sh;

    ctx.drawImage(
        this.spriteSheet.image,
        sx, sy, sw, sh,
        x, y, dw, dh
    );
}
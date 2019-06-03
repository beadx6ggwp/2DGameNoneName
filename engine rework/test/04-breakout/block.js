class Block extends Sprite {
    constructor(config) {
        config = config || {};
        super(config);

        this.hit = 0;
        this.lev = 1;
    }
    toHit() {
        this.hit++;
        this.changeAnim()
        return this.hit == this.lev;
    }
    changeAnim() {
        if(this.hit == this.lev)return;
        this.animation.setCurrFrames("s" + (this.lev - this.hit))
    }
}
Block.SID = 0;
Block.ClassName = 'Block';
ClassFactory.regClass(Block.ClassName, Block);
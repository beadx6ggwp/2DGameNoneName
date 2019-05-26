class Block extends Sprite {
    constructor(config) {
        config = config || {};
        super(config);

        this.hit = 0;
    }
}
Block.SID = 0;
Block.ClassName = 'Block';
ClassFactory.regClass(Block.ClassName, Block);
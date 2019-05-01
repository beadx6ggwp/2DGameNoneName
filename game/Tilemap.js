class TileMap {
    constructor(config) {
        this.rows = GetValue(config, 'rows', 0);
        this.cols = GetValue(config, 'cols', 0);
        this.tileWidth = GetValue(config, 'tileWidth', 0);
        this.tileHeight = GetValue(config, 'tileHeight', 0);

        this.layers = GetValue(config, 'layers', {});
        this.collision = GetValue(config, 'collision', {});
        this.tileset = GetValue(config, 'tileset', {});
    }

    getTileWithLayer(layer, row, col) {
        let index = row * this.cols + col;
        return this.layers[layer].data[index];
    }
    getCollisionTile(row, col) {
        let index = row * this.cols + col;
        return this.collision.data[index];
    }

    drawMapWithCamera(ctx, camera) {
        let tw = this.tileWidth;
        let th = this.tileHeight;

        let start = {
            x: Math.max(0, Math.floor(camera.pos.x / tw)),
            y: Math.max(0, Math.floor(camera.pos.y / th))
        }
        let end = {
            x: Math.min(Math.floor((camera.pos.x + camera.width) / tw + 1), this.cols),
            y: Math.min(Math.floor((camera.pos.y + camera.height) / th + 1), this.rows)
        }

        let img = asset.imgs[this.tileset.imgName];
        let framesPerRow = img.width / tw;
        for (let row = start.y; row < end.y; row++) {
            for (let col = start.x; col < end.x; col++) {
                let x = (col * tw);
                let y = (row * th);
                for (let layer = 0; layer < this.layers.length; layer++) {
                    let tile = this.getTileWithLayer(layer, row, col);
                    let index = tile - 1;

                    let col2 = Math.floor(index % framesPerRow);
                    let row2 = Math.floor(index / framesPerRow);

                    let sw = tw,
                        sh = th;
                    let sx = col2 * sw,
                        sy = row2 * sh;
                    let dw = sw,
                        dh = sh;

                    ctx.drawImage(
                        img,
                        sx, sy, sw, sh,
                        x, y, dw, dh
                    );
                }
            }
        }
    }
}
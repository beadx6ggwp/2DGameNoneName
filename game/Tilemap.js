class TileMap {
    constructor(config) {
        this.rows = GetValue(config, 'rows', 0);
        this.cols = GetValue(config, 'cols', 0);
        this.tileWidth = GetValue(config, 'tileWidth', 0);
        this.tileHeight = GetValue(config, 'tileHeight', 0);

        this.layers = GetValue(config, 'layers', {});
        this.collision = GetValue(config, 'collision', {});
        this.tileset = GetValue(config, 'tileset', {});

        this.tileList = [];
    }

    addToRenderList(entities) {
        let tw = this.tileWidth;
        let th = this.tileHeight;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                // 0502-1
                let x = (col * tw) + tw / 2;
                let y = (row * th) + th / 2;
                for (let i = 0; i < this.layers.length; i++) {
                    let layer = this.layers[i];
                    let tileIndex = this.getTileWithLayer(i, row, col) - 1;
                    if (tileIndex < 0) continue;
                    let tileConfig = {
                        name: 'tile',
                        pos: { x: x, y: y },
                        zindex: layer.zindex,
                        animation: this.tileset[layer.setName]
                    }
                    let entity = new Entity(tileConfig);
                    entity.animation.currentFrame = tileIndex;
                    entities.push(entity);
                    // this.tileList.push(entity);
                }
            }
        }
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

        for (let row = start.y; row < end.y; row++) {
            for (let col = start.x; col < end.x; col++) {
                let x = (col * tw);
                let y = (row * th);
                for (let i = 0; i < this.layers.length; i++) {
                    let layer = this.layers[i];
                    let img = asset.imgs[this.tileset[layer.setName].imgName];
                    let framesPerRow = img.width / tw;
                    let tile = this.getTileWithLayer(i, row, col);
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

class Tile extends Entity {
    constructor(config) {
        super(config);
    }
}
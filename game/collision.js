/**
 * 縮放比用途為取得供座標參考用的ColliderBox
 * 
 * @constructor
 * @param {object} rect
 * @param {number} scale - 縮放比
 * 
 * @constructor
 * @param {number} x, y, w, h - 座標 & 寬高
 * @param {number} scale - 縮放比
 */
class Box {
    constructor(x = 0, y = 0, w = 0, h = 0, scale = 1) {
        let o = arguments[0];
        if (typeof o === "object") {
            scale = arguments[1];
            this.pos = new Vector(o.x, o.y).multiplyScalar(scale);;
            this.w = o.w * scale;
            this.h = o.h * scale;
        } else {
            this.pos = new Vector(x, y).multiplyScalar(scale);
            this.w = w * scale;
            this.h = h * scale;
        }
    }

    clone() {
        return new Box(this.pos.x, this.pos.y, this.w, this.h);
    }
}

/**
 * 
 * @param {Box} boxA - 靜
 * @param {Box} boxB - 待測
 */
function rectCollisionResponse(boxA, boxB) {
    var r1x_minmax = { min: boxA.pos.x, max: boxA.pos.x + boxA.w }
    var r1y_minmax = { min: boxA.pos.y, max: boxA.pos.y + boxA.h }
    var r2x_minmax = { min: boxB.pos.x, max: boxB.pos.x + boxB.w }
    var r2y_minmax = { min: boxB.pos.y, max: boxB.pos.y + boxB.h }

    var collided = r1x_minmax.max > r2x_minmax.min && r1x_minmax.min < r2x_minmax.max &&
        r1y_minmax.min < r2y_minmax.max && r1y_minmax.max > r2y_minmax.min;

    var mtv = { x: 0, y: 0 };
    var edgediff = [];
    if (collided) {
        edgediff.push({ x: r1x_minmax.min - r2x_minmax.max, y: 0 });//1左
        edgediff.push({ x: r1x_minmax.max - r2x_minmax.min, y: 0 });//2右
        edgediff.push({ x: 0, y: r1y_minmax.min - r2y_minmax.max });//3上
        edgediff.push({ x: 0, y: r1y_minmax.max - r2y_minmax.min });//4下
    }

    edgediff.sort(function (a, b) {
        return Math.sqrt((a.x * a.x + a.y * a.y)) - Math.sqrt((b.x * b.x + b.y * b.y))
    });
    mtv = edgediff[0] || mtv;

    return {
        touch: collided,
        MTV: mtv
    };
}


function boxCollisionResponseToMap(gameObj, map) {
    let collider = gameObj.getCollisionBox();
    let checkPoint = [
        new Vector(collider.pos.x, collider.pos.y),
        new Vector(collider.pos.x + collider.w, collider.pos.y),
        new Vector(collider.pos.x, collider.pos.y + collider.h),
        new Vector(collider.pos.x + collider.w, collider.pos.y + collider.h)
    ];
    for (const p of checkPoint) {
        let col = Math.floor(p.x / map.tileWidth);
        let row = Math.floor(p.y / map.tileHeight);
        let tileType = getTileTypeFromPos(map, row, col);
        if (tileType == 3) continue;
        let checkObj = new Box(col * map.tileWidth, row * map.tileHeight, map.tileWidth, map.tileHeight);
        var result = rectCollisionResponse(checkObj, collider);
        if (result.touch) {
            gameObj.pos.x += result.MTV.x;
            gameObj.pos.y += result.MTV.y;
        }
    }
}
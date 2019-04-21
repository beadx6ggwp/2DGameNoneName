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
    constructor(x = 0, y = 0, w = 0, h = 0) {
        let o = arguments[0];
        if (typeof o === "object") {
            this.pos = new Vector(o.x, o.y);
            this.w = o.w;
            this.h = o.h;
        } else {
            this.pos = new Vector(x, y);
            this.w = w;
            this.h = h;
        }
    }
    clone() {
        return new Box(this.pos.x, this.pos.y, this.w, this.h);
    }
}


function InRange(value, min, max) {
    return value >= Math.min(min, max) && value <= Math.max(min, max);
}

/*
    min1           max1
    *---------------*
              min2           max2
              *---------------*
*/
function RangeIntersect(min1, max1, min2, max2) {
    // imagine here have two rectangle,and u will know how does it work
    return Math.max(min1, max1) >= Math.min(min2, max2) &&
        Math.min(min1, max1) <= Math.max(min2, max2);
}


// 之後再整理
function rect2rect(boxA, boxB) {
    let horizontal = RangeIntersect(boxA.pos.x, boxA.pos.x + boxA.w, boxB.pos.x, boxB.pos.x + boxB.w)
    let vertical = RangeIntersect(boxA.pos.y, boxA.pos.y + boxA.h, boxB.pos.y, boxB.pos.y + boxB.h);

    return horizontal && vertical;
}

function point2rect(point, box) {
    let horizontal = InRange(point.x, box.pos.x, box.pos.x + box.w);
    let vertical = InRange(point.y, box.pos.y, box.pos.y + box.h);
    return horizontal && vertical;
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

    var collided = rect2rect(boxA, boxB);

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
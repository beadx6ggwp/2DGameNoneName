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
// 目前問題為當物體斜著經過兩個地圖物件之間時，會卡住
// 假設往左下移動到兩個Tile之間，會導致上面的正常給 (1,0)反饋，但下面那塊是剛進入，反而會給(0,-1)，導致卡住
// 目前解決方法，回饋時多推一點，讓他能避過剛進入第二塊的狀況
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

// 詳細參考rectCollision與筆記0501
function rectCollisionResponse2(boxA, boxB) {
    boxA.cx = boxA.pos.x + boxA.w / 2;
    boxA.cy = boxA.pos.y + boxA.h / 2;

    boxB.cx = boxB.pos.x + boxB.w / 2;
    boxB.cy = boxB.pos.y + boxB.h / 2;

    var dx = boxB.cx - boxA.cx;// x difference between centers
    var dy = boxB.cy - boxA.cy;// y difference between centers
    var aw = (boxB.w + boxA.w) * 0.5;// average width(half width)
    var ah = (boxB.h + boxA.h) * 0.5;// average height(half height)
    let mtv = { x: 0, y: 0 };
    /* If either distance is greater than the average dimension there is no collision. */
    if (Math.abs(dx) > aw || Math.abs(dy) > ah) {
        return {
            touch: false,
            MTV: mtv
        };
    }
    // 按照佔比來判斷該往哪邊推開，這樣比較合理，不是單比dx、dy的大小
    if (Math.abs(dx / boxA.w) > Math.abs(dy / boxA.h)) {
        if (dx < 0) mtv.x = boxA.pos.x - (boxB.pos.x + boxB.w);// left
        else mtv.x = boxA.pos.x + boxA.w - boxB.pos.x; // right
    } else {
        if (dy < 0) mtv.y = boxA.pos.y - (boxB.pos.y + boxB.h);// left
        else mtv.y = boxA.pos.y + boxA.h - boxB.pos.y; // right
    }
    return {
        touch: true,
        MTV: mtv
    };
}

function mtvBounce(gameObj, mtv) {
    // 處理反彈，不是最佳解法
    let dir = new Vector(Math.sign(mtv.x), Math.sign(mtv.y));
    if (dir.x != 0) gameObj.vel.x = dir.x * Math.abs(gameObj.vel.x);
    if (dir.y != 0) gameObj.vel.y = dir.y * Math.abs(gameObj.vel.y);
}
function mtvBounce2(gameObj, mtv) {
    // v2 = v1 – 2(v1 dot n)n
    let n = new Vector(mtv.x, mtv.y).norm();
    let v = gameObj.vel.clone();
    let dot = 2 * v.dot(n);
    let v2 = v.subtract(n.multiplyScalar(dot));
    // console.log(gameObj.vel, v2);
    gameObj.vel = v2;
}


function boxCollisionResponseToMap(gameObj, map, bounce = false) {
    if (gameObj == null || map == null) return;

    let collider = gameObj.getCollisionBox();
    let checkPoint = [
        new Vector(collider.pos.x, collider.pos.y),
        new Vector(collider.pos.x + collider.w, collider.pos.y),
        new Vector(collider.pos.x, collider.pos.y + collider.h),
        new Vector(collider.pos.x + collider.w, collider.pos.y + collider.h)
    ];

    let isDeal = false;
    for (const p of checkPoint) {
        let col = Math.floor(p.x / map.tileWidth);
        let row = Math.floor(p.y / map.tileHeight);
        let tileType = map.getCollisionTile(row, col);
        if (tileType == 0) continue;
        let checkObj = new Box(col * map.tileWidth, row * map.tileHeight, map.tileWidth, map.tileHeight);
        let result = rectCollisionResponse(checkObj, collider);
        if (result.touch) {
            gameObj.pos.x += result.MTV.x * 1.0001;
            gameObj.pos.y += result.MTV.y * 1.0001;

            if (bounce && !isDeal) {
                mtvBounce2(gameObj, result.MTV)
                isDeal = true;
            }
        }
    }
}
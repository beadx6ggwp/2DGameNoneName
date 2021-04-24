var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


var mouseX, mouseY;
var isDown = false;


var x1 = 0, y1 = 0, r = 20;
var offsetr1 = { x: 0, y: 0 };
var offsetr2 = { x: 0, y: 0 };

var rect1 = {
    x: 300,
    y: 200,
    w: 200,
    h: 200,
    color: "#FFF"
};
var rect2 = {
    x: 180,
    y: 275,
    w: 100,
    h: 200,
    color: "rgba(255,127,127,0.5)",
    maxH: 50
};
var rect3 = {
    x: 180,
    y: 275,
    w: rect2.w,
    h: rect2.h,
    color: "rgba(255,255,127,0.5)",
    maxH: 50
};

var isDragR2 = false;
var isDragR1 = false;
var isDragC = false;

loop();
function loop() {
    fillRect(0, 0, 800, 600, "#222");
    //----------------------
    update();
    render();
    //-----------------
    requestAnimationFrame(loop);
}

function update() {
    //x++;
    //y++;
    if (isDragC) {
        x1 = mouseX + offsetC.x;
        y1 = mouseY + offsetC.y;
    }

    if (isDragR1) {
        rect1.x = mouseX + offsetr1.x;
        rect1.y = mouseY + offsetr1.y;
        console.log("123");
    }
    if (isDragR2) {
        rect2.x = mouseX + offsetr2.x;
        rect2.y = mouseY + offsetr2.y;
        // console.log("123");
    }

    var result = collideRectangle(rect1, rect2);
    if (result.touch) {
        rect2.x += result.MTV.x;
        rect2.y += result.MTV.y;
    }

    var result = RectCollision(rect1, rect3);
    if (result.touch) {
        rect3.x += result.MTV.x;
        rect3.y += result.MTV.y;
    }
}

function render() {
    //fillCircle(x1, y1, r, 0, Math.PI * 2, "#F00");
    fillRect(rect1.x, rect1.y, rect1.w, rect1.h, rect1.color);
    fillRect(rect2.x, rect2.y, rect2.w, rect2.h, rect2.color);
    fillRect(rect3.x, rect3.y, rect3.w, rect3.h, rect3.color);


    ctx.strokeStyle = "#555";
    ctx.moveTo(rect1.x, rect1.y);
    ctx.lineTo(rect1.x + rect1.w, rect1.y + rect1.h);
    ctx.moveTo(rect1.x + rect1.w, rect1.y);
    ctx.lineTo(rect1.x, rect1.y + rect1.h);
    ctx.stroke();

    ctx.strokeStyle = "#555";
    ctx.beginPath();
    ctx.moveTo(rect1.x + rect1.w / 2, rect1.y + rect1.h / 2);
    ctx.lineTo(rect2.x + rect2.w / 2, rect2.y + rect2.h / 2);
    ctx.stroke();
    ctx.beginPath();

    ctx.strokeStyle = "#222";
    ctx.beginPath();
    ctx.strokeRect(mouseX - rect2.w / 2, mouseY - rect2.w / 2, rect2.w, rect2.h);

    let size = 6;
    ctx.fillStyle = "#000";
    ctx.fillRect(mouseX - size / 2, mouseY - size / 2, size, size)
}

//----------圓形方形點擊判斷-----------
document.addEventListener("mousedown", function (e) {
    isDown = true;
    // console.log(mouseX, mouseY);

    var dx = x1 - mouseX;
    var dy = y1 - mouseY;

    var dxr = rect1.x - mouseX;
    var dyr = rect1.y - mouseY;

    var dxr1 = rect2.x - mouseX;
    var dyr1 = rect2.y - mouseY;

    //--圓形
    if (dx * dx + dy * dy < r * r) {
        isDragC = true;

        offsetC.x = dx;
        offsetC.y = dy;
    }
    //--方形
    if (rect2.x <= mouseX && mouseX <= rect2.x + rect2.w &&
        rect2.y <= mouseY && mouseY <= rect2.y + rect2.h) {
        isDragR2 = true;
        offsetr2.x = dxr1;
        offsetr2.y = dyr1;
    }

    if (rect1.x <= mouseX && mouseX <= rect1.x + rect1.w &&
        rect1.y <= mouseY && mouseY <= rect1.y + rect1.h) {
        isDragR1 = true;
        offsetr1.x = dxr;
        offsetr1.y = dyr;
    }
});
document.addEventListener("mouseup", function (e) {
    isDown = false;
    isDragC = false;
    isDragR1 = false;
    isDragR2 = false;
});
document.addEventListener("mousemove", function (e) {
    mouseX = e.clientX - canvas.offsetLeft;
    mouseY = e.clientY - canvas.offsetTop;


    rect2.x = mouseX - rect2.w / 2;
    rect2.y = mouseY - rect2.h / 2;
    rect3.x = mouseX - rect3.w / 2;
    rect3.y = mouseY - rect3.h / 2;
});
//--------正方形碰撞-------

// 兩種方法在r1 r2 都是方的時候沒有差，但有一個是矩形的時候，
// RectCollision就比較不理想
function RectCollision(r1, r2) {
    var r1x_minmax = { min: r1.x, max: r1.x + r1.w }
    var r2x_minmax = { min: r2.x, max: r2.x + r2.w }
    var r1y_minmax = { min: r1.y, max: r1.y + r1.h }
    var r2y_minmax = { min: r2.y, max: r2.y + r2.h }

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
    mtv = edgediff[0];

    return {
        touch: collided,
        MTV: mtv
    };
}

// r1 靜止，r2被推
// https://github.com/frankarendpoth/frankarendpoth.github.io/blob/master/content/pop-vlog/javascript/2018/018-rectangle-collision/rectangle-collision.html
function collideRectangle(r1, r2) {
    r1.cx = r1.x + r1.w / 2;
    r1.cy = r1.y + r1.h / 2;

    r2.cx = r2.x + r2.w / 2;
    r2.cy = r2.y + r2.h / 2;

    var dx = r2.cx - r1.cx;// x difference between centers
    var dy = r2.cy - r1.cy;// y difference between centers
    var aw = (r2.w + r1.w) * 0.5;// average width(half width)
    var ah = (r2.h + r1.h) * 0.5;// average height(half height)
    let mtv = { x: 0, y: 0 };
    /* If either distance is greater than the average dimension there is no collision. */
    if (Math.abs(dx) > aw || Math.abs(dy) > ah)
        return {
            touch: false,
            MTV: mtv
        };;
    /* To determine which region of this rectangle the rect's center
    point is in, we have to account for the scale of the this rectangle.
    To do that, we divide dx and dy by it's width and height respectively. */
    // 按照佔比來判斷該往哪邊推開，這樣比較合理，不是單比dx、dy的大小
    if (Math.abs(dx / r1.w) > Math.abs(dy / r1.h)) {
        // if (dx < 0) mtv.x = r1.x - r2.w;// left
        // else mtv.x = r1.x + r1.w; // right
        if (dx < 0) mtv.x = r1.x - (r2.x + r2.w);// left
        else mtv.x = r1.x + r1.w - r2.x; // right
    } else {
        // if (dy < 0) mtv.y = r1.y - r2.h; // top
        // else mtv.y = r1.y + r1.h; // bottom
        if (dy < 0) mtv.y = r1.y - (r2.y + r2.h);// left
        else mtv.y = r1.y + r1.h - r2.y; // right
    }
    return {
        touch: true,
        MTV: mtv
    };
}

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");




function fillRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function strokeRect(x, y, w, h, color) {
    ctx.strokeStyle = color;

    ctx.strokeRect(x, y, w, h);
}

function fillCircle(x, y, r, start, end, color) {
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.arc(x, y, r, start, end);
    ctx.closePath();
    ctx.fill();
}

function strokeCircle(x, y, r, start, end, color) {
    ctx.stroke = color;

    ctx.beginPath();
    ctx.arc(x, y, r, start, end);
    ctx.closePath();
    ctx.stroke();
}

function drawLine(x1, y1, x2, y2, width, color) {
    ctx.lineWidth = width;
    ctx.strokeStyle = color;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
}
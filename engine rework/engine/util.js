/**
 * Retrieves a value from an object.
 *
 * @param {object} source - The object to retrieve the value from.
 * @param {string} key - The name of the property to retrieve from the object. If a property is nested, the names of its preceding properties should be separated by a dot (`.`) - `banner.hideBanner` would return the value of the `hideBanner` property from the object stored in the `banner` property of the `source` object.
 * @param {*} defaultValue - The value to return if the `key` isn't found in the `source` object.
 *
 * @return {*} The value of the requested key.
 */
function GetValue(source, key, defaultValue) {
    if (source.hasOwnProperty(key)) {
        return source[key];
    }
    else if (key.indexOf('.') !== -1) {
        var keys = key.split('.');
        var parent = source;
        var value = defaultValue;

        //  Use for loop here so we can break early
        for (var i = 0; i < keys.length; i++) {
            if (parent.hasOwnProperty(keys[i])) {
                //  Yes it has a key property, let's carry on down
                value = parent[keys[i]];

                parent = parent[keys[i]];
            }
            else {
                //  Can't go any further, so reset to default
                value = defaultValue;
                break;
            }
        }

        return value;
    }
    else {
        return defaultValue;
    }
}


function CreateCanvas(id, width, height, center, border) {
    let div = document.createElement("div");
    div.id = "divForCanvas";

    // canvas sitting
    let canvas = document.createElement("canvas");
    let style_arr = [
        "display: block;",
        "margin: 0 auto;",
        // "background: #FFF;",
        "padding: 0;"
    ];
    canvas.id = id;
    width = width || window.innerWidth;
    height = height || window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    if (border) style_arr.push("border:1px solid #000;");

    canvas.style.cssText = style_arr.join("");

    // 是否要畫面置中
    if (center) {
        div.style.cssText = [
            "position:absolute;",
            "width:" + width + "px;",
            "height:" + height + "px;",
            "left:50%;",
            "top:50%;",
            "margin-top: -" + height / 2 + "px;",
            "margin-left: -" + width / 2 + "px;",
            // "background:#000;"
        ].join("");

        document.body.appendChild(div);
        div.appendChild(canvas);
    } else {
        document.body.appendChild(canvas);
    }

    return canvas;
}

function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild;
}

function Arrayinsert(arr, pos, items) {
    if (pos < 0 || pos > arr.length) {
        return;
    }
    else {
        // array.splice(start[, deleteCount[, item1[, item2[, ...]]]])
        arr.splice.apply(arr, [pos, 0].concat(items));
        // arr.splice(pos, 0, items);
        // 第一種
        // var len = arr.length - pos;
        // var a2 = arr.slice(pos);
        // arr.splice(pos, len, items, ...a2);

        // 第二種
        // var len = arr.length - pos;
        // var a2 = arr.slice(pos);
        // a2.unshift(pos, len, items);
        // arr.splice.apply(arr, a2);
    }
}


//----tool-------
function toRadio(angle) {
    return angle * Math.PI / 180;
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function random(min, max) {
    return Math.random() * (max - min) + min;
}
function sleep(milliseconds) {
    var start = new Date().getTime();
    while (1)
        if ((new Date().getTime() - start) > milliseconds)
            break;
}
function minsecms() {
    var d = new Date();
    return `${d.getMinutes()}:${d.getSeconds()}.${d.getMilliseconds()}`;
}
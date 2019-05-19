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

function Arrayinsert(arr, pos, ele) {
    if ((arr.length === 0 && pos === 0) || (pos === arr.length)) {
        this.push(ele);
    }
    else if (pos < 0 || pos > arr.length) {
        return;
    }
    else {
        // 第一種
        var len = arr.length - pos;
        var a2 = arr.slice(pos);
        arr.splice(pos, len, ele, ...a2);

        // 第二種
        // var len = arr.length - pos;
        // var a2 = arr.slice(pos);
        // a2.unshift(pos, len, ele);
        // arr.splice.apply(arr, a2);
    }
}
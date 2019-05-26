
var canvas, ctx;

var x = 0;
var game, cfg;
var w = 800, h = 600;

window.onload = function () {
    game = new Game();
    game.addListener(new AppEventListener({
        afterRender: function () {
            var debugInfo = [
                `predictFrame:${FrameState.predictFrame.toFixed(3)}`,
                `currFrame:${FrameState.currFrame}`
            ]
            document.getElementById('p1').innerHTML = debugInfo.join('<br>');
        }
    }));

    let tsc = game.sceneManager.createScene([{ name: 'title', x: 100, y: 100, w: 400, h: 500, color: '#000' }]);
    let msc = game.sceneManager.createScene([{ name: 'main', x: 100, y: 100, w: 400, h: 500, color: '#777' }]);
    let esc = game.sceneManager.createScene([{ name: 'end', x: 100, y: 100, w: 400, h: 500, color: '#000' }]);
    initTsc(tsc);
    initMsc(msc);
    initEsc(esc);

    game.sceneManager.bringToTop(msc);

    ResManager.loadResConfig('res/json/res.json',
        (loadedCount, totalCount, currLoadObj) => {
            var pro = (loadedCount / totalCount) * 100 | 0;
            $("#pTxt").text("Loading:" + pro + "%");
            $("#pBar").width(pro * 3);
        },
        (m) => {
            console.log('OK');
            loadJSON('res/json/gamecfg.json', (e, xobj) => {
                let data = JSON.parse(xobj.responseText);
                cfg = data;
            })
        }
    );
    game.run();
}

function initTsc(sc) {
    //創建UI,創建加載進度條
    var pCBar = $("<div id='pCBar' style='position:absolute;border-radius:3px;border:2px solid yellow;left:50px;top:245px;height:10px;width:300px;'></div>");
    var pBar = $("<div id='pBar' style='position:absolute;left:0px;top:0px;overflow:hidden;background-color:red;width:1px;height:9px;top:1px;'></div>");
    var text = $("<div id='pTxt' style='text-align:center;position:absolute;font-size:26px;color:white;height:40px;width:400px;top:210px;'>Loading...</div>")
    // debugger
    pCBar.append(pBar);
    sc.holder.appendChild(text[0]);
    sc.holder.appendChild(pCBar[0]);

}
function initMsc(sc) {
    var pLifeTxt = $("<div id='pLifeTxt' style='text-align:left;position:absolute;font-size:26px;color:yellow;height:40px;width:130px;left:10px'>Life:0</div>");
    var pLevTxt = $("<div id='pLevTxt' style='text-align:left;position:absolute;font-size:26px;color:yellow;height:40px;width:130px;left:150px'>Level:1</div>");
    var pScTxt = $("<div id='pScTxt' style='text-align:left;position:absolute;font-size:26px;color:yellow;height:40px;width:130px;left:290px'>Score:0</div>")

    sc.holder.appendChild(pLifeTxt[0]);
    sc.holder.appendChild(pLevTxt[0]);
    sc.holder.appendChild(pScTxt[0]);

    var ball = sc.createRObj(Ball.ClassName, [{ name: 'ball', r: 10 }]);
    ball.setPos(200, 200);
    ball.setVel(100, 200);

    var block1 = sc.createRObj(Block.ClassName, [{ name: 'block' }]);
    block1.rw = 50;
    block1.rh = 20;
    block1.setPos(200, 40);
    var block1 = sc.createRObj(Block.ClassName, [{ name: 'block' }]);
    block1.rw = 50;
    block1.rh = 20;
    block1.setPos(260, 40);


    var stick = sc.createRObj(Stick.ClassName, [{ name: 'stick' }]);
    stick.rw = 80;
    stick.rh = 20;
    stick.setPos(300, 200);
}
function initEsc(sc) {
    var pEndTxt = $("<div id='pEndTxt' style='text-align:center;font-size:35px;position:absolute;border-radius:3px;color:white;left:50px;top:245px;height:10px;width:300px;'>Game Over</div>")

    sc.holder.appendChild(pEndTxt[0]);
}


function rect2rect(r1, r2) {
    let bsx = r1.pos.x - r1.rw / 2 - r2.rw / 2,
        bex = r1.pos.x + r1.rw / 2 + r2.rw / 2,
        bsy = r1.pos.y - r1.rh / 2 - r2.rh / 2,
        bey = r1.pos.y + r1.rh / 2 + r2.rh / 2;
    if (r2.pos.x >= bsx && r2.pos.x <= bex &&
        r2.pos.y >= bsy && r2.pos.y <= bey) {
        return true;
    }
    return false;
}

window.onblur = function () {
    if (game) game.stop()
}

window.onfocus = function () {
    if (game) game.run()
}

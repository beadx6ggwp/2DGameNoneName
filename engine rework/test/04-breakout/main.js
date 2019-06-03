
var canvas, ctx;

var game, cfg, state = -1;
var ball, stick;
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

    game.addListener(new AppEventListener({
        afterRender: function () {
            let sc = game.sceneManager.getCurrentScene();
            if (state < 0) return;
            // 清完磚塊
            if (cfg.blockNum == 0) {
                if (cfg.level == cfg.maxLev) {
                    showWin();
                } else {
                    cfg.level++;
                    loadLevel(sc);
                }
            }
            if (cfg.life <= 0) {
                showLose();
            }
            showUI();
        }
    }));

    let tsc = game.sceneManager.createScene([{ name: 'title', x: 100, y: 100, w: 400, h: 500, color: '#000' }]);
    let msc = game.sceneManager.createScene([{ name: 'main', x: 100, y: 100, w: 400, h: 500, color: '#777' }]);
    let esc = game.sceneManager.createScene([{ name: 'end', x: 100, y: 100, w: 400, h: 500, color: '#000' }]);
    initTsc(tsc);
    initMsc(msc);
    initEsc(esc);

    game.sceneManager.bringToTop(tsc);

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
                setTimeout(showMain, 700);
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
    var pScTxt = $("<div id='pScTxt' style='text-align:left;position:absolute;font-size:26px;color:yellow;height:40px;width:130px;left:280px'>Score:0</div>")

    sc.holder.appendChild(pLifeTxt[0]);
    sc.holder.appendChild(pLevTxt[0]);
    sc.holder.appendChild(pScTxt[0]);
}
function initEsc(sc) {
    var pEndTxt = $("<div id='pEndTxt' style='text-align:center;font-size:35px;position:absolute;border-radius:3px;color:white;left:50px;top:245px;height:10px;width:300px;'>Game Over</div>")

    sc.holder.appendChild(pEndTxt[0]);
}

function showMain() {
    let mainSc = game.sceneManager.getSceneByName('main');
    game.sceneManager.bringToTop(mainSc);
    loadCfg(mainSc);
    loadLevel(mainSc);
    resetGame();
}

function showUI() {
    $("#pScTxt").text("Score:" + cfg.score);
    $("#pLevTxt").text("Level:" + cfg.level);
    $("#pLifeTxt").text("Life:" + cfg.life);
}
function showWin() {
    $("#pEndTxt").text("Mission Complete!!");
    let esc = game.sceneManager.getSceneByName('end');
    game.sceneManager.bringToTop(esc);
}
function showLose() {
    $("#pEndTxt").text("Game Over!");
    let esc = game.sceneManager.getSceneByName('end');
    game.sceneManager.bringToTop(esc);
}

function loadCfg(sc) {
    // load stick
    var cStick = cfg.stick;
    stick = sc.createRObj(Stick.ClassName, [{ name: 'stick' }]);
    stick.rw = cStick.w;
    stick.rh = cStick.h;
    stick.setPos(sc.w / 2, sc.h - 30);
    var data = ResManager.getResByName(FrameRes.TypeName, cStick['resName']);
    var anims = data.data[cStick['fName']];
    stick.setAnims(anims);

    // load ball
    var cBall = cfg.ball;
    ball = sc.createRObj(Ball.ClassName, [{ name: 'ball', r: cBall.r }]);
    ball.setPos(sc.w / 2, sc.h / 2);
    ball.setVel(100, 200);
    var data = ResManager.getResByName(FrameRes.TypeName, cBall['resName']);
    var anims = data.data[cBall['fName']];
    ball.setAnims(anims);
}

function loadLevel(sc) {
    var cLev = cfg['level'];
    var cBlock = cfg['block'];
    var cLevData = cfg[`lev${cLev}`];
    var data = ResManager.getResByName(FrameRes.TypeName, cBlock['resName']);
    var anims = data.data[cBlock['fName']];
    var bOffY = 60
    for (var i = 0; i < cLevData.length; i++) {
        for (var j = 0; j < cLevData[i].length; j++) {
            var bData = cLevData[i][j];
            if (bData > 0) {
                var bk = sc.createRObj(Block.ClassName, [{ name: 'block' }]);
                bk.setAnims(anims, "s" + bData);
                bk.lev = bData;
                bk.rw = cBlock.w;
                bk.rh = cBlock.h;
                bk.setPos(j * bk.rw + (bk.rw * 0.5), bOffY + i * bk.rh);
                cfg.blockNum++;
            }
        }
    }
}

function resetBall() {
    ball.setPos(stick.pos.x, stick.pos.y - stick.rh / 2 - ball.r - 1);
    ball.setVel(0, 0);
}
function resetGame() {
    resetBall();
    state = 0;
}

function launchBall() {
    state = 1;
    ball.setVel(100, -200);
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
    // if (game) game.stop()
}

window.onfocus = function () {
    // if (game) game.run()
}

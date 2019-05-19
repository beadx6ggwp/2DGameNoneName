
var canvas, ctx;

var x = 0;
var game, sc;
var w = 800, h = 600;

window.onload = function () {
    // canvas = CreateCanvas('canvas', 800, 600, true, true);
    //https://i.imgur.com/2ucWbfe.jpg
    // canvas.style['backgroundImage'] = "url('https://i.imgur.com/2ucWbfe.jpg')";
    // ctx = canvas.getContext('2d');
    // ctx.fillRect(50, 50, 100, 100);


    game = new Game();

    game.sceneManager.createScene([{ name: 'sc3', x: 200, y: 200, color: '#FF7' }]);
    game.sceneManager.createScene([{ name: 'sc2', x: 150, y: 150, color: '#F77' }]);
    sc = game.sceneManager.createScene([{ name: 'sc1', x: 100, y: 100}]);

    sc.setBGImg('https://i.imgur.com/2ucWbfe.jpg', 0);

    
    // sc.ctx = document.getElementById('cv_Unnamed_0').getContext('2d');
    // sc.ctx.fillStyle = "#FF7";
    // sc.ctx.fillRect(700, 20, 100, 100);
    
    game.addListener(new AppEventListener({
        afterRender: function () {
            // console.log(FrameState.predictFrame, FrameState.currFrame)
        }
    }))

    game.run()
}
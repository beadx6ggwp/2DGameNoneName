class Scene {
    constructor(config) {
        config = config || {};
        this.name = GetValue(config, 'name', `Unnamed_${Scene.SID++}`);

        // this.width = GetValue(config, 'width', 800);
        // this.height = GetValue(config, 'height', 600);
        // this.canvasOnCenter = GetValue(config, 'canvasOnCenter', 1);
        // this.canvas = CreateCanvas(`${this.name}`, this.width, this.height, this.canvasOnCenter);

        this.x = GetValue(config, 'x', 0) | 0;
        this.y = GetValue(config, 'y', 0) | 0;
        this.w = GetValue(config, 'w', 800) | 0;
        this.h = GetValue(config, 'h', 600) | 0;
        // 如果希望有UI場景，可試著用null處理
        this.color = GetValue(config, 'color', '#000');// null透明

        // 需要注意canvas zindex是否會被div蓋住
        var _holder = document.createElement('div');
        _holder.id = `sc_${this.name}`;
        _holder.style.cssText = 'z-index:auto;position:absolute; left:0px; top:0px';
        var _canvas = document.createElement('canvas');
        _canvas.id = `cv_${this.name}`;
        _canvas.style.cssText = 'z-index:auto; position:absolute; left:0px; top:0px;';
        this.holder = _holder;
        this.canvas = _canvas
        this.setPos();
        this.setSize();
        this.setColor(this.color);

        this.ctx = _canvas.getContext('2d');

        this.holder.appendChild(_canvas);
        document.body.appendChild(_holder);

    }

    update() {

    }

    render() {

    }

    setPos(x, y) {
        this.x = x || this.x;
        this.y = y || this.y;
        this.holder.style.left = `${this.x}px`;
        this.holder.style.top = `${this.y}px`;
    }
    setSize(w, h) {
        this.w = w || this.w;
        this.h = h || this.h;
        this.holder.style['width'] = `${this.w}px`;
        this.holder.style['height'] = `${this.h}px`;
        this.canvas['width'] = `${this.w}`;
        this.canvas['height'] = `${this.h}`;
    }
    setColor(color) {
        this.color = color;
        this.holder.style['background-color'] = this.color;
    }
    setBGImg(imgURL, pattern) {
        this.holder.style['background-image'] = `url(${imgURL})`;
        switch (pattern) {
            // 置中
            case 0:
                this.holder.style['background-repeat'] = 'no-repeat';
                this.holder.style['background-position'] = 'center';
                break;
            // 拉伸鋪滿
            case 1:
                this.holder.style['background-size'] = `${this.w}px ${this.h}px`;
                break;
        }
    }

    show() {
        this.holder.style['display'] = 'block';
    }
    hide() {
        this.holder.style['display'] = 'none';
    }

    destroy() {
        this.listeners = null;
        this.holder.remove();
        this.canvas.remove();
        this.canvas = this.holder = this.ctx = null;
    }
}
Scene.SID = 0;
ClassFactory.regClass('Scene', Scene);

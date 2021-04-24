/*
sc.addListener(new SceneEventListener({
        beforeRender: function () {},
        afterRender: function () {}
    }))
*/

class SceneEventListener extends EventListener {
    constructor(config) {
        super(config);

        this.enabled = true;
        config = config || {};
        this.onBeforeRender = GetValue(config, 'beforeRender', () => true);
        this.onAfterRender = GetValue(config, 'afterRender', () => true);
    }
}

class Scene {
    constructor(config) {
        config = config || {};
        this.name = GetValue(config, 'name', `Scene_${Scene.SID++}`);

        // --------display setting-------------
        this.x = GetValue(config, 'x', 0) | 0;
        this.y = GetValue(config, 'y', 0) | 0;
        this.w = GetValue(config, 'w', 800) | 0;
        this.h = GetValue(config, 'h', 600) | 0;
        // 如果希望有UI場景，可用null處理
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
        this.setColor();

        this.ctx = _canvas.getContext('2d');
        // 不使用雙線性穿插
        this.ctx.imageSmoothingEnabled = false;

        this.holder.appendChild(_canvas);
        document.body.appendChild(_holder);

        //----------game-------------------
        this.actionManager = new ActionEventManager(this);
        this.listeners = [];
        this.robjs = [];
        this.namedRObjs = {};
    }

    // render object operate
    createRObj(className, initArgs) {
        var obj = ClassFactory.newInstance(className || 'RenderObj', initArgs);
        this.addRObj(obj);
        return obj;
    }
    addRObj(renderObj) {
        renderObj.owner = this;
        this.actionManager.acitons.push(...renderObj.actions);
        this.robjs.push(renderObj);
        this.namedRObjs[renderObj.name] = renderObj;
    }
    removeRObjByName(name) {
        this.namedRObjs[name] && (this.namedRObjs[name].canRemove = true);
    }
    removeAllcanRemove() {
        for (let i = this.robjs.length - 1; i >= 0; i--) {
            const robj = this.robjs[i];
            if (robj.canRemove) {
                delete this.robjs[i];
                this.robjs.splice(i, 1);
            }
        }
    }
    getRObjByName(name) {
        return this.namedRObjs[name];
    }
    clearRObj() {
        this.robjs = [];
        this.namedRObjs = {};
    }

    // Event
    addListener(ln) {
        this.listeners.push(ln);
    }
    clearListener() {
        this.listeners.length = 0;
    }
    update(dt, tick) {
        for (const robj of this.robjs) {
            robj.update(dt, tick);
        }

        this.actionManager.update(dt);

        this.removeAllcanRemove();
    }

    render() {
        this.ctx.clearRect(0, 0, this.w, this.h);

        this.beforeRender();

        for (const robj of this.robjs) {
            this.ctx.save();
            robj.render(this.ctx);
            this.ctx.restore();
        }

        this.afterRender();
    }

    beforeRender() {
        for (const ln of this.listeners) {
            ln.enabled && ln.onBeforeRender();
        }
    }
    afterRender() {
        for (const ln of this.listeners) {
            ln.enabled && ln.onAfterRender();
        }
    }

    // display operate
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
        this.color = color || this.color;
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
Scene.ClassName = 'Scene';
ClassFactory.regClass(Scene.ClassName, Scene);

class AppEventListener extends EventListener {
    constructor(config) {
        super(config);

        this.enabled = true;
        config = config || {};
        this.onBeforeRender = GetValue(config, 'beforeRender', () => true);
        this.onAfterRender = GetValue(config, 'afterRender', () => true);
    }
}

class Game {
    constructor(config) {
        config = config || {};

        this.listeners = [];
        this.sceneManager = new SceneManager();

        this.started = false;
        this.running = false;
        this.rafID = null;
        
        this.tickcount = 0;
    }

    addListener(ln) {
        this.listeners.push(ln);
    }
    clearListener() {
        this.listeners.length = 0;
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

    mainloop(timestamp) {
        FrameState.update();
        FPStats.begin();

        if (this.running) {
            this.tickcount++;
            this.beforeRender();

            var scene = this.sceneManager.getCurrentScene();
            if (scene) {
                scene.update(FrameState.deltaTime / 1000, FrameState.tickcount);
                scene.render();
            }

            this.afterRender();
        };
        FPStats.end();
        this.rafID = requestAnimationFrame(this.mainloop.bind(this));
    }

    reset() {
        // reset timestamp
        this.lastTime = window.performance.now();
    }
    run() {
        if (this.started) {
            console.log('Loop is stared');
            return;
        }
        this.started = true;
        this.running = true;
        this.reset();

        FrameState.start();
        this.rafID = requestAnimationFrame(this.mainloop.bind(this));
    }

    pause() {
        if (!this.running) this.reset();
        this.running = !this.running;
    }

    stop() {
        this.started = false;
        this.running = false;
        cancelAnimationFrame(this.rafID);
    }
}
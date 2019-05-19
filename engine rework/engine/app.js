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

        this.updateStep = GetValue(config, 'updateStep', 120);
        this.stepTime = 1 / this.updateStep;
    }

    addListener(ln) {
        this.listeners.push(ln);
    }
    clearListener() {
        this.listeners.length = 0;
    }

    mainloop(timestamp) {
        FrameState.update();
        if (this.running) {
            this.beforeRender();


            this.afterRender();
        };
        this.rafID = requestAnimationFrame(this.mainloop.bind(this));
    }

    beforeRender() {
        for (const ln of this.listeners) {
            if (ln.enabled) ln.onBeforeRender();
        }
    }
    afterRender() {
        for (const ln of this.listeners) {
            if (ln.enabled) ln.onAfterRender();
        }
    }

    run() {
        if (this.started) {
            console.log('Loop is stared');
            return;
        }
        this.started = true;
        this.running = true;

        FrameState.start();
        this.rafID = requestAnimationFrame(this.mainloop.bind(this));
    }

    pause() {
        this.running = !this.running;
    }

    stop() {
        this.started = false;
        this.running = false;
        cancelAnimationFrame(this.rafID);
    }
}
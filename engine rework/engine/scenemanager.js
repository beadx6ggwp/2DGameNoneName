class SceneManager {
    constructor() {
        this.namedScenes = {};

        // stack: 最後的元素為頂
        this.scenes = [];
    }

    createScene(className, initArgs) {
        let sc;
        if (arguments.length == 1) {
            // [{ name: 'sc3', x: 100, y: 100, color: '#FF7' }]
            sc = ClassFactory.newInstance('Scene', arguments[0]);
        } else {
            // 處理繼承場景的建立
            sc = ClassFactory.newInstance(className || 'Scene', initArgs);
        }
        this.push(sc);
        return sc;
    }

    // 場景前移
    forward(scene) {
        let zindex = this.getSceneZindex(scene);
        if (zindex == this.scenes.length - 1) return;
        this.swapByZindex(zindex, zindex + 1)
    }
    // 場景後移
    back(scene) {
        let zindex = this.getSceneZindex(scene);
        if (zindex == 0) return;
        this.swapByZindex(zindex, zindex - 1)
    }
    // 推入場景至頂部
    push(scene) {
        if (this.getSceneByName(scene.name)) return false;

        this.scenes.push(scene);
        this.namedScenes[scene.name] = scene;
        this.sortSceneZindex();
    }
    // 移除頂部場景
    pop() {
        let sc = this.scenes.pop();
        if (sc != null) {
            sc.destroy();
            delete this.namedScenes[sc.name];
            this.sortSceneZindex();
        }
    }
    // 移動某場景至頂
    bringToTop(scene) {
        let zindex = this.getSceneZindex(scene);
        // 已經是最上面
        if (zindex == this.scenes.length - 1) return;

        this.scenes.splice(zindex, 1);
        this.scenes.push(scene);
        this.sortSceneZindex();
    }
    // 移動某場景至底
    bringToLast(scene) {
        let zindex = this.getSceneZindex(scene);
        // 已經是最下面
        if (zindex == 0) return;

        this.scenes.splice(zindex, 1);
        this.scenes.unshift(scene);
        this.sortSceneZindex();
    }
    // 移除某場景
    remove(name) {
        let sc = this.getSceneByName(name);
        if (sc != null) {
            sc.destroy();
            delete this.namedScenes[sc.name];
            this.sortSceneZindex();
        }
    }

    swapByZindex(index1, index2) {
        if (index1 < 0 || index1 >= this.scenes.length ||
            index2 < 0 || index2 >= this.scenes.length) return;
        [this.scenes[index1], this.scenes[index2]] = [this.scenes[index2], this.scenes[index1]];
        this.sortSceneZindex();
    }

    // 重新指定zindex，也相當於scene的index
    sortSceneZindex() {
        for (let i = 0; i < this.scenes.length; i++) {
            const sc = this.scenes[i];
            if (!sc) debugger
            sc.holder.style['z-index'] = i;
        }
    }

    getSceneByName(name) {
        return this.namedScenes[name];
    }

    getSceneZindex(scene) {
        return scene.holder.style['z-index'] | 0;
    }

    getCurrentScene() {
        return this.scenes[this.scenes.length - 1];
    }

    clearAllScene() {
        for (const sc of this.scenes) {
            sc.destroy();
        }
        this.namedScenes = {};
        this.scenes = [];
    }
}
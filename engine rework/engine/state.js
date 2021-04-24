class StateContext {
    constructor(owner) {
        this.states = {};
        this.currState = null;
    }
    update() {
        this.currState.update();

        this.currState.change();
    }
    changeState(name) {
        this.currState && this.currState.exit();
        this.currState = this.states[name];
        this.currState.enter();
    }
    regState(state) {
        this.states[state.name] = state;
        return this;
    }
    unRegState(name) {
        if (this.states[name] != null && this.currState != this.states[name]) {
            delete this.states[name];
        }
    }
    unRegAll() {
        this.states = {};
        this.currState = null;
    }
}

class State {
    constructor(name, owner) {
        this.name = name;
        this.owner = owner;
    }
    enter() {
        return
    }
    update() {
        return
    }
    change() {
        return
    }
    exit() {
        return
    }
}
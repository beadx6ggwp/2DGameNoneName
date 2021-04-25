class EventListener {
    constructor(config) {
        if (this.constructor.name === 'EventListener')
            throw Error("This class must be inherited");
    }
}

class ActionEventManager {
    constructor(scene) {
        this.owner = scene;
        this.acitons = [];
    }
    update(dt) {
        for (const action of this.acitons) {
            if (!action.isEnabled || !action.update(dt)) continue;

            // 只有目標不在的話，暫時先保留
            if (action.target.canRemove) continue;
            // 如果物件本身不在了，那也沒必要保留這個動作事件
            if (action.sender.canRemove) {
                action.canRemove = true;
                continue;
            }
            for (const obj of this.owner.robjs) {
                if (action.target.indexOf(obj.name) != -1) {
                    action.actionFN(action.sender, obj);
                }
            }
        }
        this.removeAllCanRemove();
    }
    removeAllCanRemove() {
        for (let i = this.acitons.length - 1; i >= 0; i--) {
            const action = this.acitons[i];
            if (action.canRemove) {
                delete this.acitons[i];
                this.acitons.splice(i, 1);
            }
        }
    }
    add(actionEvent) {
        let action = {};
        action = arguments.length > 1 ? new ActionEvent(...arguments) : actionEvent;
        action.owner = this.owner;
        this.acitons.push(action);
    }
}

class ActionEvent {
    constructor(name, sender, target, actionFN, checkTime) {
        this.owner = sender.owner;
        this.name = name || `AtionEvent_${ActionEvent.SID}`;
        this.sender = sender;
        this.target = target;
        this.actionFN = actionFN;

        this.isEnabled = true;
        this.checkTime = checkTime || 0;
        this.accumulator = 0;
        this.canRemove = false;

        ActionEvent.SID++;
    }
    update(dt) {
        if (this.checkTime != 0)
            this.accumulator += FrameState.deltaTime;

        if (this.accumulator >= this.checkTime) {
            this.accumulator -= this.checkTime;
            return true;
        }
        return false;
    }
}
ActionEvent.SID = 0;
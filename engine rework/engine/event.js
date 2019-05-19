class EventListener {
    constructor(config) {
        if (this.constructor.name === 'EventListener')
            throw Error("This class must be inherited");
    }
}
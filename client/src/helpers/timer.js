export default class Timer {
    constructor(callback, delay) {
        this.callback = callback;
        this.remaining = delay;
        this.resume();
    }

    resume() {
        this.clear();
        this.start = Date.now();
        this.timerId = setTimeout(this.callback, this.remaining);
    }

    pause() {
        this.clear();
        this.remaining -= Date.now() - this.start;
    }

    clear() {
        clearTimeout(this.timerId);
    }
}

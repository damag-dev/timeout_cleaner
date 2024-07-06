/* 
    This composable is used to clean up all the timeouts, intervals and event listeners when the component is unmounted.
*/

/*
    import { registerCleaner } from "../composables/cleaner";
    const cleaner = registerCleaner();

    // setTimeout

    const timeout = cleaner.useSetTimeout(() => {
        console.log("setTimeout")
    }, 1000)

    // setInterval

    const interval = cleaner.useSetInterval(() => {
        console.log("setInterval")
    }, 1000)

    // addEventListener
    
    cleaner.useAddEventListener(window, "keydown", (event) => {
        if (event.key == "Escape" || event.key == "Backspace") {
            console.log("eventListener");
        }
    });
*/

import { onBeforeUnmount, onMounted } from "vue";

class Cleaner {
    constructor() {
        this.timeouts = [];
        this.intervals = [];
        this.events = [];
        this.isRegistered = false;
    }

    clearAll() {
        this.timeouts.forEach((timeout) => {
            clearTimeout(timeout);
        });
        this.intervals.forEach((interval) => {
            clearInterval(interval);
        });
        this.events.forEach(({ target, event, callback }) => {
            target.removeEventListener(event, callback);
        });
        this.timeouts = [];
        this.intervals = [];
        this.events = [];
        this.isRegistered = false;
        console.log("cleaner: all cleared");
    }

    registerClearAll() {
        if (this.isRegistered) return;
        this.isRegistered = true;
        console.log("cleaner: clearAll registered");
        onBeforeUnmount(() => this.clearAll());
    }

    useSetTimeout(callback, delay) {
        this.registerClearAll(); // just in case
        const timeout = setTimeout(callback, delay);
        this.timeouts.push(timeout);
        return timeout;
    }

    useSetInterval(callback, delay) {
        this.registerClearAll(); // just in case
        const interval = setInterval(callback, delay);
        this.intervals.push(interval);
        return interval;
    }

    useAddEventListener(target, event, callback) {
        this.registerClearAll(); // just in case
        target.addEventListener(event, callback);
        this.events.push({ target, event, callback });
    }
}

export function registerCleaner() {
    console.log("cleaner: registerCleaner");
    let cleaner = new Cleaner();
    onMounted(() => {
        cleaner.registerClearAll(); // fix for rare bug when component thinks it's not mounted
    });
    return cleaner;
}

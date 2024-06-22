/* 
    This composable is used to clean up all the timeouts, intervals and event listeners when the component is unmounted.
*/

/*
    import { useSetTimeout, useSetInterval, useAddEventListener } from "../composables/cleaner";

    // setTimeout

    const timeout = useSetTimeout(() => {
        console.log("setTimeout")
    }, 1000)

    // setInterval

    const interval = useSetInterval(() => {
        console.log("setInterval")
    }, 1000)

    // addEventListener
    
    useAddEventListener(window, "keydown", (event) => {
        if (event.key == "Escape" || event.key == "Backspace") {
            console.log("eventListener");
        }
    });
*/

import { onBeforeUnmount } from "vue";

const clear = {
    timeouts : [],
    intervals : [],
    events : []
}

let isRegistered = false

function clearAll(){
    console.log("clearing all")
    clear.timeouts.forEach((timeout) => {
        clearTimeout(timeout)
    })
    clear.intervals.forEach((interval) => {
        clearInterval(interval)
    })
    clear.events.forEach(({target, event, callback}) => {
        target.removeEventListener(event, callback)
    })
    clear.timeouts = []
    clear.intervals = []
    clear.events = []
    isRegistered = false
}

function registerClearAll(){
    if(isRegistered) return
    isRegistered = true
    console.log("registering clearAll")
    onBeforeUnmount(clearAll)
}

export function useSetTimeout(callback, delay){
    registerClearAll()
    const timeout = setTimeout(callback, delay)
    clear.timeouts.push(timeout)
    return timeout
}

export function useSetInterval(callback, delay){
    registerClearAll()
    const interval = setInterval(callback, delay)
    clear.intervals.push(interval)
    return interval
}

export function useAddEventListener(target, event, callback){
    registerClearAll()
    target.addEventListener(event, callback)
    clear.events.push({target, event, callback})
}
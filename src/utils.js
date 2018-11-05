/**
 * Compile user and default arguments into single opbject
 * @param  {object} obj           user supplied argument object
 * @param  {object} defaultObject defautl argument object
 * @return {object}               compiled argument object
 */
export function defaults (obj, defaultObject) {
    obj = {...obj};
    for (const k in defaultObject) {
        if (obj[k] === undefined) {
            obj[k] = defaultObject[k];
        }
    }
    return obj;
}

/**
 * Debounce a funciton
 * @param  {Function} fn function to debounce
 * @param  {int}   ms miliseconds to deboiunce
 * @return {Function}      debounced fucntion
 */
export function debounce(fn, ms) {
    let timerId;
    return function(...args) {
        if (timerId) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
            fn(...args);
            timerId = null;
        }, ms);
    };
}

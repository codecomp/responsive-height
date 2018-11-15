/**
 * Merge two objects ogether pulling defaults from one and overwtring from the other
 * @param  {object} obj           user supplied argument object
 * @param  {object} defaultObject defautl argument object
 * @return {object}               compiled argument object
 */
export function mergeObjects (obj, defaultObject) {
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

/**
 * Determine if passed object is a DOM elment
 * @param  {object}  obj
 * @return {Boolean}
 *
 * https://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
 */
export function isElement(obj) {
    try {
        //Using W3 DOM2 (works for FF, Opera and Chrome)
        return obj instanceof HTMLElement;
    }
    catch (e){
        //Browsers not supporting W3 DOM2 don't have HTMLElement and
        //an exception is thrown and we end up here. Testing some
        //properties that all elements have (works on IE7)
        return (typeof obj === 'object') &&
            (obj.nodeType === 1) && (typeof obj.style === 'object') &&
            (typeof obj.ownerDocument === 'object');
    }
}

/**
 * Determine if a passed object is a nodelist
 * @param  {object}  obj
 * @return {Boolean}
 *
 * https://gist.github.com/Tomalak/818a78a226a0738eaade
 */
export function isNodeList(obj) {
    const stringRepr = Object.prototype.toString.call(obj);

    return typeof obj === 'object' &&
        /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
        typeof obj.length !== 'undefined' &&
        (obj.length === 0 || (typeof obj[0] === 'object' && obj[0].nodeType > 0));
}

import { set, isEmpty, toArray, chunk } from 'lodash';
import { debounce, mergeObjects } from './utils';

export const defaultOptions = {
    global:         false,
    delay:          200,
    widths:         [],
    child:     		null,
    exclude_get:    null,
    exclude_set:    null,
    before_init:    null,
    after_init:     null,
    window_resize:  null,
    before_resize:  null,
    after_resize:   null,
    after_destroy:  null
};

/**
 * validate options passed by end user
 * @param  {object} options
 * @return {object}         found errors by paramater
 */
export function validateOptions(options) {
    const errors = {};

    // Global must be a boolean
    if (typeof options.global !== 'boolean') {
        set(errors, 'global.type', 'global option should be boolean');
    }

    // delay must be an int of 0 or more
    if (typeof options.delay !== 'number' || options.delay < 0 || (options.delay !== 0 && (options.delay % 1) !== 0)) { // eslint-disable-line max-len
        set(errors, 'delay.type', 'delay option should be an integer');
    }

    // Callabcks must be null or a function
    for (const attribute of ['before_init', 'after_init', 'window_resize', 'before_resize', 'after_resize', 'after_destroy']) { // eslint-disable-line max-len
        if (typeof options[attribute] !== 'function' && options[attribute] !== null){
            set(errors, `${attribute}.type`, `${attribute} option is not a valid callback`);
        }
    }

    // CSS selector paramaters bust be a string or null
    for (const attribute of ['child', 'exclude_get', 'exclude_set']) {
        if (typeof options[attribute] !== 'string' && options[attribute] !== null){
            set(errors, `${attribute}.type`, `${attribute} option must be a string or null`);
        }
    }

    // Widths must be a vlaid multi dimensional array
    if (options.widths instanceof Array !== true) {
        set(errors, 'widths.type', 'widths option should be an array');
    } else {
        for (const width of options.widths) {
            // Individual widths must only have 2 paeramaters
            if (width instanceof Array !== true || width.length !== 2) {
                set(errors, 'widths.format', 'width options should be an array');
                break;
            }

            // The size must be a int of 0 or more
            if (typeof width[0] !== 'number' || width[0] < 0 || (width[0] !== 0 && (width[0] % 1) !== 0)) {
                set(errors, 'widths.format.size', 'width sizes must be an integer of 0 or more');
                break;
            }

            // The column count must be an int of 1 or more
            if (typeof width[1] !== 'number' || width[1] < 1 || (width[1] % 1) !== 0) {
                set(errors, 'widths.format', 'width columns must be an integer of 1 or more');
                break;
            }
        }
    }

    return errors;
}

/**
 * Build object of references to objects we want to modify heigths of
 * @param  {element} container  cotnainer element
 * @param  {string | null} childQuery css query sleector content
 * @return {array}
 */
export function collectElememnts(container, childQuery) {
    if ( !container || !container.children.length ){
        return [];
    }

    if ( childQuery ){
        const elements = [];
        for (const el of container.children) {
            const result = el.querySelector(childQuery);
            if (result) {
                elements.push(result);
            }
        }
        return elements;
    }

    return toArray(container.children);
}

/**
 * Determine if the window size is greater than the supplied width
 * @param  {int} width screen width to check
 * @return {bool}
 */
export function checkWindowWidth(width) {
    if ( window.matchMedia ) {
        return window.matchMedia(`screen and (min-width:${width}px)`).matches;
    }

    if ( window.innerWidth > width ){
        return true;
    }

    return false;
}

/**
 * Work out how many columns we need based on current screen size and options
 * @param  {boolean} globalOption global option
 * @param  {array} widthsOption   widths array from options
 * @return {integer}              number of colums to run logic on
 */
export function getRequiredRowSize(globalOption, widthsOption) {
    if ( globalOption ){
        return -1;
    }

    for (const width of widthsOption) {
        if ( checkWindowWidth(width[0]) ) {
            return width[1];
        }
    }

    return -1;
}

/**
 * Remove any existing javascript set height on all elements
 * @param {array} elements
 */
export function unsetHeights(elements) {
    for (const el of elements) {
        el.style.removeProperty('height');
    }
}

/**
 * update heights of supplied row of elemenrts
 * @param  {array} array of elements to resize
 * @return
 */
export function updateRow(row) {
    // If we only have one row reset the heights
    if ( row.length === 1 ){
        return;
    }
    // calculate largest element in row
    let maxHeight = 0;
    for (const el of row) {
        maxHeight = el.offsetHeight > maxHeight ? el.offsetHeight : maxHeight;
    }
    // set heights of all elements in row
    for (const el of row) {
        el.style.height = `${maxHeight}px`;
    }
}

/**
 * Trigger funciton to kickoff resizeTo
 * @param  {array} elements
 * @param  {object} options
 * @return
 */
export function startResize(elements, options) {
    // remove old heights from elements
    unsetHeights(elements);
    // work out needed number of collumns required per row
    const rowSize = getRequiredRowSize(options.global, options.widths);
    // split elements by collumns required
    let rows;
    if (rowSize > 0) {
        rows = chunk(elements, rowSize);
    } else {
        rows = [elements];
    }
    // Update rows
    for (const row of rows) {
        updateRow(row);
    }
}

/**
 * Module entrypoint
 * @type {class}
 */
export class ResponsiveHeight {
    constructor(el, opts) {
        this.container = el;
        this.options = mergeObjects(opts, defaultOptions);
        this.init();
    }

    init() {
        const validation = validateOptions(this.options);
        if ( !isEmpty(validation) ) {

            console.error('Errors found in options'); // eslint-disable-line no-console
            // TODO display validaton errors to user in a clean way
            console.error(validation); // eslint-disable-line no-console

        } else {

            if ( typeof this.options.before_init === 'function' ) {
                this.options.before_init();
            }

            // Collect an array of elements to run logic on
            this.elements = collectElememnts(this.container, this.options.child);

            // Run initial resize event
            startResize(this.elements, this.options);

            // Bind resize evenrt
            window.addEventListener('resize', debounce(() => { this.update(); }, 200));

            if ( typeof this.options.after_init === 'function' ) {
                this.options.after_init();
            }

        }
    }

    update() {
        startResize(this.elements, this.options);
    }
}

import { set, isEmpty } from 'lodash';
import { mergeObjects } from './utils';

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
                set(errors, 'widths.format', 'width sizes must be an integer of 0 or more');
                break;
            }

            // The column count must be an int of 1 or more
            if (typeof width[1] !== 'number' || width[1] < 1 || (width[1] % 1) !== 0) {
                set(errors, 'widths.format', 'width colusoumns must be an integer of 1 or more');
                break;
            }
        }
    }

    return errors;
}

/**
 * Module entrypoint
 * @type {class}
 */
export class ResponsiveHeight {
    constructor(el, opts) {
        this.options = mergeObjects(opts, defaultOptions);
        this.init();
    }

    init() {
        if ( typeof this.options.before_init === 'function' ) {
            this.options.before_init();
        }

        const validation = validateOptions(this.options);
        if ( !isEmpty(validation) ) {
            console.error('Errors found in options'); // eslint-disable-line no-console
            // TODO display validaton errors to user in a clean way
            console.error(validation); // eslint-disable-line no-console
        } else {

            //TODO start the process off

            if ( typeof this.options.after_init === 'function' ) {
                this.options.after_init();
            }
        }
    }
}

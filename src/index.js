import { mergeObjects } from './utils';

const defaults = {
    global:         false,
    delay:          200,
    widths:         [],
    child:     		false,
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
 * Module entrypoint
 * @type {class}
 */
export class ResponsiveHeight {
    constructor(el, args) {
        this.options = mergeObjects(args, defaults);
        this.init();
    }

    init() {
        if ( typeof this.options.before_init === 'function' ) {
            this.options.before_init();
        }

        this.validateArguments();

        //TODO start the process off

        if ( typeof this.options.after_init === 'function' ) {
            this.options.after_init();
        }
    }

    validateArguments() {
        if (typeof this.options.global !== 'boolean') {
            throw 'Option global is not valid';
        }

        if (typeof this.options.delay !== 'number' || this.options.delay < 0 || (this.options.delay !== 0 && (this.options.delay % 1) !== 0)) { // eslint-disable-line max-len
            throw 'Option delay is not valid';
        }

        for (const attribute of ['before_init', 'after_init', 'window_resize', 'before_resize', 'after_resize', 'after_destroy']) { // eslint-disable-line max-len
            if (typeof this.options[attribute] !== 'function' && this.options[attribute] !== null){
                throw 'Option callback is not valid';
            }
        }
    }
}

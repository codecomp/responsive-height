import { mergeObjects } from './utils';

const defaults = {
    global:         false,
    delay:          200,
    widths:         [],
    child:     		false,
    verbose:        false,
    exclude_get:    false,
    exclude_set:    false,
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
export function checkWindowWidth(width){
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

        //TODO start the process off

        if ( typeof this.options.after_init === 'function' ) {
            this.options.after_init();
        }
    }
}

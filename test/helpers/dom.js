import { JSDOM } from 'jsdom';
const { document } = new JSDOM('<!doctype html><html><body><div class="test">test</div></body></html>').window;

// Setup globals
global.document = document;
global.window = document.defaultView;
global.requestAnimationFrame = callback => {
    setTimeout(callback, 0);
};

// Define matchMedia and allow us to enable and disable match matchMedia
const matchMedia = window.matchMedia || (() => {
    return { matches: true, addListener: () => {}, removeListener: () => {} };
});

global.window.enableMatchMedia = () => {
    global.window.matchMedia = matchMedia;
};

global.window.disableMatchMedia = () => {
    delete(global.window.matchMedia);
};

global.window.enableMatchMedia();

// Setup navigator
global.navigator = {
    userAgent: 'node.js',
    platform: 'node'
};

// Setup fucntion to resize the window
const resizeEvent = document.createEvent('CustomEvent');
resizeEvent.initEvent('resize', true, true);

global.window.resizeTo = (width, height) => {
    global.window.innerWidth = width || global.window.innerWidth;
    global.window.innerHeight = height || global.window.innerHeight;
    global.window.dispatchEvent(resizeEvent);
};

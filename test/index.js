import sinon from 'sinon';
import { assert } from 'chai';
import { mergeObjects, debounce } from '../src/utils';
import { cloneDeep } from 'lodash';
import { checkWindowWidth, defaultOptions, validateOptions, collectElememnts, getRequiredRowSize, unsetHeights, updateRow, startResize, ResponsiveHeight } from '../src';

describe('Helpers', () => {
    it('documet and window should exist', () => {
        assert.exists(document);
        assert.exists(window);
    });
    it('window should be resizeable', () => {
        const width = window.innerWidth;
        window.resizeTo(1920);
        assert.notEqual(width, window.innerWidth);
    });
    it('window should trigger resize event', (done) => {
        function func(){
            window.removeEventListener('resize', func);
            done();
        }
        window.addEventListener('resize', func);
        window.resizeTo(1920);
    }).timeout(50);
});

describe('Utility functions', () => {
    it('mergeObjects should compile an object', () => {
        assert.isObject(mergeObjects({}, {}));
    });
    it('mergeObjects should overwrite default object attriburtes with new attriburtes', () => {
        const obj = { 'test': 'user' };
        const defaultObj = { 'test': 'default' };
        assert.propertyVal(mergeObjects(obj, defaultObj), 'test', 'user');
    });
    it('mergeObjects should add undefined user obejct items from default', () => {
        const obj = {};
        const defaultObj = { 'test': 'default' };
        assert.propertyVal(mergeObjects(obj, defaultObj), 'test', 'default');
    });
    it('debounce should return a function', () => {
        const func = function(){};
        assert.isFunction(debounce(func, 100));
    });
    it('debounce should run after timeout', (done) => {
        let result = false;
        function func(){
            result = true;
        }
        const debounceFunc = debounce(func, 10);
        debounceFunc();
        setTimeout(() => {
            assert.isTrue(result);
            done();
        }, 20);
    });
    it('debounce should pass over attributes', (done) => {
        let result = false;
        function func(value){
            result = value;
        }
        const debounceFunc = debounce(func, 10);
        debounceFunc(true);
        setTimeout(() => {
            assert.isTrue(result);
            done();
        }, 20);
    });
    it('debounce should override last timeout', (done) => {
        let result = false;
        const func = function (){
            result = true;
        };
        const debouncedFunc = debounce(func, 15);
        debouncedFunc();
        setTimeout(() => {
            debouncedFunc();
        }, 10);
        setTimeout(() => {
            assert.isFalse(result);
            done();
        }, 20);
    });
});

describe('Export functions', () => {
    it('checkWindowWidth should run matchMedia when available to check min screen size', () => {
        window.enableMatchMedia();
        assert.isTrue(checkWindowWidth(500)); // Matchmedia jsdom set to default to true;
    });
    it('checkWindowWidth should fallback to innerWidth', () => {
        window.disableMatchMedia();
        window.resizeTo(500);
        assert.isTrue(checkWindowWidth(100));
    });
    it('checkWindowWidth should return false if window width is too big', () => {
        window.disableMatchMedia();
        window.resizeTo(500);
        assert.isFalse(checkWindowWidth(1000));
    });
    it('collectElememnts should return an array of expected elements', () => {
        const container = document.createElement('div');
        const element = '<div><span class="child">Test</span></div>';
        container.innerHTML = element.repeat(10);
        document.body.appendChild(container);

        assert.isArray(collectElememnts(null, false));
        assert.isEmpty(collectElememnts(null, false));
        assert.isArray(collectElememnts(container, false));
        assert.isNotEmpty(collectElememnts(container, false));
        assert.isArray(collectElememnts(container, '.child'));
        assert.isNotEmpty(collectElememnts(container, '.child'));
        assert.isEmpty(collectElememnts(container, '.empty'));
        assert.equal(collectElememnts(container, '.child')[0].tagName.toLowerCase(), 'span');
        assert.equal(collectElememnts(container, false)[0].tagName.toLowerCase(), 'div');
        document.body.innerHTML = '';
    });
    it('getRequiredRowSize should return -1 on global', () => {
        assert.equal(getRequiredRowSize(true, [[0, 1]]), -1);
    });
    it('getRequiredRowSize should correctly calculate the required column number', () => {
        window.resizeTo(2000);

        assert.equal(getRequiredRowSize(false, [[0, 1]]), 1);
        assert.equal(getRequiredRowSize(false, [[9999, 2], [0, 1]]), 1);
        assert.equal(getRequiredRowSize(false, [[1000, 2], [0, 1]]), 2);
    });
    it('getRequiredRowSize should default to -1', () => {
        assert.equal(getRequiredRowSize(false, []), -1);
    });
    it('unsetHeights should remove height from element style property', () => {
        const element = document.createElement('div');
        element.style.width = '100px';
        element.style.height = '100px';
        document.body.appendChild(element);

        assert.equal(element.style.height, '100px');
        unsetHeights([element]);
        assert.isEmpty(element.style.height);
        document.body.innerHTML = '';
    });
    it('updateRow should not update element if only one element is pased', () => {
        const element = document.createElement('div');
        element.style.width = '100px';
        element.style.height = '100px';
        document.body.appendChild(element);

        assert.equal(element.style.height, '100px');
        updateRow([element]);
        assert.equal(element.style.height, '100px');
        document.body.innerHTML = '';
    });
    it('updateRow should update element heights to largest found size', () => {
        const elements = [
            {
                offsetHeight: 100,
                style: {
                    height: '100px'
                }
            },
            {
                offsetHeight: 200,
                style: {
                    height: '200px'
                }
            }
        ];

        assert.equal(elements[0].style.height, '100px');
        updateRow(elements);
        assert.equal(elements[0].style.height, '200px');
    });
    it('startResize correctly resizes items into rows', () => {
        window.resizeTo(2000);
        const elements = [];
        const element = {
            offsetHeight: 100,
            style: {
                height: '100px',
                removeProperty: (prop) => {}
            }
        };
        for (let i=0; i<20; i++) {
            elements.push(cloneDeep(element));
        }
        elements[19].offsetHeight = 200;
        elements[19].style.height = '200px';
        startResize(elements, {global: false, widths: [[1000, 10], [0, 1]]});

        assert.equal(elements[0].style.height, '100px');
        assert.equal(elements[10].style.height, '200px');
    });
});

describe('Callback functions', () => {
    it('before_init should be called', (done) => {
        new ResponsiveHeight(null, {before_init: () => {
            done();
        }});
    });
    it('after_init should be called', (done) => {
        new ResponsiveHeight(null, {after_init: () => {
            done();
        }});
    });
});

describe('Option validation', () => {
    it('global should be a boolean', () => {
        function func(attr) {
            return validateOptions(mergeObjects({ global: attr }, defaultOptions));
        }
        assert.nestedProperty(func(1), 'global.type');
        assert.nestedProperty(func(null), 'global.type');
        assert.notNestedProperty(func(true), 'global.type');
    });
    it('delay should be an integer', () => {
        function func(attr) {
            return validateOptions(mergeObjects({ delay: attr }, defaultOptions));
        }
        assert.nestedProperty(func(1.5), 'delay.type');
        assert.nestedProperty(func(0.5), 'delay.type');
        assert.nestedProperty(func(-1), 'delay.type');
        assert.nestedProperty(func(true), 'delay.type');
        assert.nestedProperty(func(null), 'delay.type');
        assert.notNestedProperty(func(100), 'delay.type');
        assert.notNestedProperty(func(0), 'delay.type');
    });
    it('css selectors should be a string or null', () => {
        function func(attr) {
            return validateOptions(mergeObjects({ child: attr }, defaultOptions));
        }
        assert.nestedProperty(func(1), 'child.type');
        assert.nestedProperty(func(true), 'child.type');
        assert.notNestedProperty(func('.class'), 'child.type');
        assert.notNestedProperty(func(null), 'child.type');
    });
    it('widths should be an array', () => {
        function func(attr) {
            return validateOptions(mergeObjects({ widths: attr }, defaultOptions));
        }
        assert.nestedProperty(func(1), 'widths.type');
        assert.nestedProperty(func(null), 'widths.type');
        assert.notNestedProperty(func([]), 'widths.type');
        assert.notNestedProperty(func([[0, 1]]), 'widths.type');
    });
    it('widths should have correct formatting', () => {
        function func(attr) {
            return validateOptions(mergeObjects({ widths: attr }, defaultOptions));
        }
        assert.nestedProperty(func([[1]]), 'widths.format');
        assert.nestedProperty(func([[0, 0, 0]]), 'widths.format');
        assert.nestedProperty(func([[0, 0]]), 'widths.format');
        assert.nestedProperty(func([[-1, -1]]), 'widths.format');
        assert.nestedProperty(func([[1, -1]]), 'widths.format');
        assert.nestedProperty(func([[true, false]]), 'widths.format');
        assert.notNestedProperty(func([[0, 1]]), 'widths.format');
    });
    it('callbacks should be a function or null', () => {
        function func(attr) {
            return validateOptions(mergeObjects({ before_init: attr }, defaultOptions));
        }
        assert.nestedProperty(func(1), 'before_init.type');
        assert.nestedProperty(func(false), 'before_init.type');
        assert.notNestedProperty(func(() => {}), 'before_init.type');
        assert.notNestedProperty(func(null), 'before_init.type');
    });
    it('invalid options should throw error', () => {
        const spy = sinon.stub(console, 'error');
        new ResponsiveHeight(null, {delay: false});
        assert(spy.calledWith('Errors found in options'));
        spy.restore();
    });
});

describe('Plugin API', () => {
    it('update triggers a resize', () => {
        window.resizeTo(2000);
        const elements = {
            children: []
        };
        const element = {
            offsetHeight: 100,
            style: {
                height: '100px',
                removeProperty: () => {}
            }
        };
        for (let i=0; i<20; i++) {
            elements.children.push(cloneDeep(element));
        }
        const api = new ResponsiveHeight(elements, {global: false, widths: [[1000, 10], [0, 1]]});

        assert.equal(elements.children[0].style.height, '100px');
        assert.notEqual(elements.children[10].style.height, '200px');
        elements.children[19].offsetHeight = 200;
        elements.children[19].style.height = '200px';
        api.update();
        assert.equal(elements.children[10].style.height, '200px');
    });
});

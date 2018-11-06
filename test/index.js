import { assert } from 'chai';
import { testConst, testFunction } from '../src';
import { mergeObjects, debounce } from '../src/utils';

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

describe('Variable import test', () => {
    it('should equal the imported value', () => {
        assert.equal(testConst, 1);
    });

    it('should be accessable via function', () => {
        const result = testFunction();
        assert.equal(result, testConst);
    });
});

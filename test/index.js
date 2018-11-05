import { assert } from 'chai';
import { testConst, testFunction } from '../src';

describe('Variable import test', () => {
    it('should equal the imported value', () => {
        assert.equal(testConst, 1);
    });

    it('should be accessable via function', () => {
        const result = testFunction();
        assert.equal(result, testConst);
    });
});

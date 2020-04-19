const assert = require('assert');
const santanderCycles = require('../methods/santanderCycles.js')

describe('Test Santander Cyles API Call', () => {
 it('should return  no of cycles', () => {
        santanderCycles.howManyBikes("Cranmer Road, Stockwell");
        //assert.equal(toDoist.foo(), "foo");
    });
});

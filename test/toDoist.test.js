const assert = require('assert');
const toDoist = require('../methods/toDoist.js')

describe('Test Todoist API Call', () => {
 it('should return foo', () => {
        toDoist.addTask("test card ---- >>>", "Personal", 4, "tomorrow");
        //assert.equal(toDoist.foo(), "foo");
    });
 it('should return 9', () => {
        assert.equal(3 * 3, 9);
    });
});

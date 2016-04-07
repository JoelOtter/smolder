var Smolder = require('../lib/smolder');
var expect = require('chai').expect;

describe('Smolder with embedded schema', function() {

    var tfs = Smolder(require('./testfunctions'));

    var peopleData = [
        { name: 'Joel', age: 22 },
        { name: 'Jake', age: 24 }
    ];

    it('should get the correct result for correctly-shaped data', function() {
        expect(tfs.sumArray([1, 2, 3])).to.equal(1 + 2 + 3);
    });

    it('should reshape input data to get the correct result', function() {
        expect(tfs.sumArray(peopleData)).to.equal(22 + 24);
    });

    it('should handle multiple arguments with correct shapes', function() {
        expect(tfs.sumProducts([1, 2, 3], [4, 5, 6])).to.equal(
            (1 * 4) + (2 * 5) + (3 * 6)
        );
    });

    it('should handle arguments with different schema on same data', function() {
        expect(tfs.totalPeople(peopleData, peopleData)).to.equal(
            "Joel and Jake have a combined age of 46"
        );
    });

    it('should allow parameters to lack a schema', function() {
        expect(tfs.multiplyAges(peopleData, 2)).to.eql(
            [22 * 2, 24 * 2]
        );
    });

})

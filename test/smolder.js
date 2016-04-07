var Smolder = require('../lib/smolder');
var expect = require('chai').expect;

describe('Smolder', function() {

    describe('with embedded schema', function() {

        var tfs = Smolder(require('./testfunctions'));

        var peopleData = [
            { name: 'Joel', age: 22, height: 1.9, lastName: 'Auterson' },
            { name: 'Jake', age: 24, height: 1.8, lastName: 'Hall' }
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

        it('should allow hints to be used', function() {
            expect(tfs.sumArray(peopleData, {arr: 'height'})).to.equal(1.9 + 1.8);
        });

        it('should allow different hints for each parameter', function() {
            expect(tfs.totalPeople(peopleData, peopleData, {names: 'lastName', ages: 'height'}))
                .to.equal("Auterson and Hall have a combined age of 3.7");
        });

        it('should ignore non-object hints parameter', function() {
            expect(tfs.sumArray(peopleData, [])).to.equal(46);
        });

    });

})

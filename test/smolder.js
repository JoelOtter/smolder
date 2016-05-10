var expect = require('chai').expect;
require('mocha-sinon');
var Smolder = require('../lib/smolder');

describe('Smolder', function() {

    var peopleData = [
        { name: 'Joel', age: 22, height: 1.9, lastName: 'Auterson' },
        { name: 'Jake', age: 24, height: 1.8, lastName: 'Hall' }
    ];

    describe('require', function() {

        it('should not modify the original library', function() {
            var tfs = originaltfs = require('./testfunctions');
            var smoldered = Smolder(tfs);
            expect(smoldered).not.to.eql(originaltfs);
            expect(tfs).to.eql(originaltfs);
        });

    });

    describe('with embedded schema', function() {

        var tfs = Smolder(require('./testfunctions'));

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

        it('should ignore non-object/array/string hints parameter', function() {
            expect(tfs.sumArray(peopleData, Function())).to.equal(46);
        });

        it('should allow a string as the hint for every parameter', function() {
            expect(tfs.sumArray(peopleData, 'height')).to.equal(1.9 + 1.8);
        });

        it('should not modify functions with no schema', function() {
            var tfs = require('./testfunctions');
            var smoldered = Smolder(tfs);
            expect(smoldered.product).to.eql(tfs.product);
            expect(smoldered.product([1, 2, 3])).to.equal(6);
        });

        it('should allow array hints', function() {
            expect(tfs.fakeGraph(peopleData, ['lastName', 'height'])).to.eql([
                'Auterson: 1.9',
                'Hall: 1.8'
            ]);
        });

        it('should allow object hints in multi-arg hint', function() {
            expect(tfs.fakeGraph(
                peopleData,
                {data: {label: 'lastName', value: 'height'}}
            )).to.eql([
                'Auterson: 1.9',
                'Hall: 1.8'
            ]);
        });

        it('should allow object hints without multi-arg', function() {
            expect(tfs.fakeGraph(
                peopleData,
                {label: 'lastName', value: 'height'}
            )).to.eql([
                'Auterson: 1.9',
                'Hall: 1.8'
            ]);
        });

    });

    describe('with user provided schema', function() {

        var schema = require('./testschema');
        var tfs = Smolder(require('./testfunctions'), schema);

        it('uses the user provided schema instead of the embedded one', function() {
            expect(tfs.sumArray(peopleData)).to.equal("JoelJake");
        });

    });

    describe('with no provided schema', function() {

        it('should not modify the library if no schema is provided', function() {
            this.sinon.stub(console, 'warn');
            var tfs = require('./testfunctions');
            var smoldered = Smolder(tfs, 'trash');
            expect(smoldered).to.eql(tfs);
            expect(console.warn.calledOnce).to.be.true;
            expect(console.warn.calledWith(
                'No valid schema provided - not modifying library.'
            )).to.be.true;
        });

    });

})

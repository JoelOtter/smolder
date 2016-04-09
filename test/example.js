// Test to ensure the example in the README works
var Smolder = require('../lib/smolder');
var expect = require('chai').expect;

describe('README example', function() {

    var peopleData = [
        {
            name: 'Joel',
            info: {
                age: 22,
                height: 1.9,
                middleName: 'Robert',
                lastName: 'Auterson'
            }
        },
        {
            name: 'Jake',
            info: {
                age: 24,
                height: 1.85,
                middleName: 'Wild',
                lastName: 'Hall'
            }
        }
    ];

    var schema = {
        sumArray: {
            arr: ['Number']
        }
    };

    var tfs = Smolder(require('./testfunctions'), schema);

    it('sums ages by default', function() {
        expect(tfs.sumArray(peopleData)).to.equal(46);
    });

    it('sums heights with hint', function() {
        var hints = {
            arr: 'height'
        };
        expect(tfs.sumArray(peopleData, hints)).to.equal(3.75);
    });

    it('can use string hints', function() {
        expect(tfs.sumArray(peopleData, 'height')).to.equal(3.75);
    });

})

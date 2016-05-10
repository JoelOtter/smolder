module.exports = {

    __SMOLDER_SCHEMA: {
        sumArray: {
            arr: ['Number']
        },
        sumProducts: {
            a: ['Number'],
            b: ['Number']
        },
        totalPeople: {
            ages: ['Number'],
            names: ['String']
        },
        multiplyAges: {
            ages: ['Number']
        },
        fakeGraph: {
            data: [{
                label: 'String',
                value: 'Number'
            }]
        }
    },

    sumArray: function (arr) {
        return arr.reduce(function(a, b) {
            return a + b;
        });
    },

    sumProducts: function (a, b) {
        result = 0;
        for (var i = 0; i < Math.min(a.length, b.length); i++) {
            result += a[i] * b[i];
        }
        return result;
    },

    totalPeople: function (names, ages) {
        var nameString = names.join(" and ");
        var totalAge = 0;
        for (var i = 0; i < ages.length; i++) {
            totalAge += ages[i];
        }
        return nameString + " have a combined age of " + totalAge;
    },

    multiplyAges: function(ages, mult) {
        return ages.map(function(age) {
            return age * mult;
        });
    },

    product: function(arr) {
        return arr.reduce(function(a, b) {
            return a * b;
        });
    },

    fakeGraph: function(data) {
        var result = [];
        data.forEach(function (item) {
            result.push(item.label + ': ' + item.value);
        });
        return result;
    }

};

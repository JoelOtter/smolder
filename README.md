# Smolder

[![Build Status](https://travis-ci.org/JoelOtter/smolder.svg?branch=master)](https://travis-ci.org/JoelOtter/smolder) [![Coverage Status](https://coveralls.io/repos/github/JoelOtter/smolder/badge.svg?branch=master)](https://coveralls.io/github/JoelOtter/smolder?branch=master) [![](https://img.shields.io/npm/v/smolder.svg)](https://www.npmjs.com/package/smolder)

Smolder (_it's-a-mold-er_ - sorry) is a JavaScript library wrapper which aims to reshape the input to functions to match a provided schema. It's kind of like casting on speed.

The actual reshaping is done using [Reshaper](https://github.com/JoelOtter/reshaper).

## Installation

`npm install smolder`

## Usage

#### `Smolder(library, [schema])`

- `library`: The JavaScript library to be wrapped. This should be imported - you can do `Smolder(require('your library'))`, for example.
- `[schema]`: The schema for the library's functions. This can also be included within the library itself, as shown in the examples.

## Examples

If we have a library, `arrays.js`, which looks like this:

```javascript
module.exports = {
    sumArray: function (array) {
        return arr.reduce(function(a, b) {
            return a + b;
        });
    }
};
```

And we have some data on people:

```javascript
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
```

We can use Smolder to apply the sumArray function to the data above, and still get the result we want.

```javascript
// First let's create a schema for the arrays library.
var schema = {
    sumArray: {
        array: ['Number'] // Parameter 'array' must be an array of numbers.
    }
}

var Smolder = require('smolder');
// Smolder will wrap the arrays library for us
var arrays = Smolder(require('arrays'), schema);

arrays.sumArray(peopleData);
// => 46
```

The reshaping process will by default use the first match it finds. In the above case, it creates an array using the `age` values.

If we want to use something other than the default, we can provide Smolder with 'hints', like so:

```javascript
var hints = {
    array: 'height' // We want to sum the heights, not the ages.
};

arrays.sumArray(peopleData, hints);
// => 3.75
```

It's also possible to just provide Smolder with a string or array of strings as the hint. In this case, it'll use this hint for all parameters.

```javascript
arrays.sumArray(peopleData, 'height');
// => 3.75
```

If we're using a library we created, we can build it with support for Smolder out-of-the-box. We just need to add the schema to the library's exports, like so:

```javascript
module.exports = {

    __SMOLDER_SCHEMA: {
        sumArray: {
            array: ['Number']
        }
    },

    sumArray: function (array) {
        var result = 0;
        for (var i = 0; i < array.length; i++) {
            result += array[i];
        }
        return result;
    }
};
```

We can then require through Smolder without specifying a schema:

```javascript
var arrays = Smolder(require('arrays'));
```

For any function or parameter where a schema is not specified, it won't be changed by the Smolder wrapper.

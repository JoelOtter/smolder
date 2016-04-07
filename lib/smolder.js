var getParamNames = require('get-parameter-names');
var reshaper = require('reshaper');

function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

function wrapFunction(f, schema) {
    return function() {
        var params = getParamNames(f);
        var newArgs = [];
        var hints = {};
        // Extract the hints from the extra argument,
        // but only if it's an object.
        if (arguments.length > params.length) {
            var extra = arguments[params.length];
            if (isObject(extra)) {
                hints = extra;
            }
        }
        for (var arg = 0; arg < params.length; arg++) {
            var param = params[arg];
            if (schema.hasOwnProperty(param)) {
                // If we have a schema for the parameter, use reshaper
                // to transform the provided argument to match.
                newArgs.push(reshaper.findShape(
                    arguments[arg], schema[param], hints[param]
                ));
            } else {
                // If we don't have a schema for the parameter,
                // we'll just use the non-reshaped argument.
                newArgs.push(arguments[arg]);
            }
        }
        return f.apply(this, newArgs);
    };
}

function Smolder(toWrap, providedSchema) {
    var schema = providedSchema || toWrap.__SMOLDER_SCHEMA;
    if (!isObject(schema)) {
        console.warn('No valid schema provided - not modifying library.');
        return toWrap;
    }
    var keys = Object.keys(toWrap);
    wrapped = {};
    for (var k = 0; k < keys.length; k++) {
        var o = keys[k];
        if (typeof(toWrap[o]) === 'function' && schema.hasOwnProperty(o)) {
            wrapped[o] = wrapFunction(toWrap[o], schema[o]);
        } else {
            wrapped[o] = toWrap[o];
        }
    }
    return wrapped;
}

module.exports = Smolder;

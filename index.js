/*global module*/
'use strict';

module.exports = createQuery;

var defaults = {
    $where: false
};

/**
 * Creates an match function to test objects against a mongodb query
 *
 * @param query
 * @param options
 * @returns {Function}
 */
function createQuery (query, options) {

    options = options || defaults;

    /**
     * Match functions
     * @see http://docs.mongodb.org/manual/reference/operators/#query-selectors
     */
    var fn = {

        $all: function (obj, value) {
            if (!(value instanceof Array) || !(obj instanceof Array)){
                return false;
            }
            for (var i = 0; i < value.length; i++) {
                if (obj.indexOf(value[i]) === -1) {
                    return false;
                }
            }
            return true;
        },

        $gt: function (obj, value) {
            return obj > value;
        },

        $gte: function (obj, value) {
            return obj >= value;
        },

        $in: function (obj, value) {
            return value.indexOf(obj) !== -1;
        },

        $lt: function (obj, value) {
            return obj < value;
        },

        $lte: function (obj, value) {
            return obj <= value;
        },

        $ne: function (obj, value) {
            return obj !== value;
        },

        $nin: function (obj, value) {
            if (typeof obj === 'undefined') { return true; }
            return value.indexOf(obj) === -1;
        },

        $and: function (obj, conditions) {
            for (var i = 0; i < conditions.length; i++) {
                if (!match(obj, conditions[i])){
                    return false;
                }
            }
            return true;
        },

        $nor: function (obj, conditions) {
            for (var i = 0; i < conditions.length; i++) {
                if (match(obj, conditions[i])){
                    return false;
                }
            }
            return true;
        },

        $not: function (obj, condition) {
            return !match(obj, condition);
        },

        $or: function (obj, conditions) {
            for (var i = 0; i < conditions.length; i++) {
                if (match(obj, conditions[i])){
                    return true;
                }
            }
            return false;
        },

        $exists: function (obj, mustExist) {
            return (typeof obj !== 'undefined') === mustExist;
        },

        $mod: function (obj, div) {
            var divisor = div[0],
                remainder = div[1];
            return obj % divisor === remainder;
        },

        $regex: function (obj, regex, query) {
            var options = query.$options;
            return (new RegExp(regex, options)).test(obj);
        },

        $options: function () {
            return true;
        },

        $where: function (obj, fn) {
            if (!options.$where) {
                return false;
            }

            if (typeof fn === 'function') {
                fn = 'return (' + fn.toString() + ').call(this);';
            }
            fn = new Function('obj', fn);
            return !!fn.call(obj, obj);
        },

        $elemMatch: function (array, query) {
            for (var i = 0; i < array.length; i++) {
                if (match(array[i], query)) {
                    return true;
                }
            }
            return false;
        },

        $size: function (array, length) {
            return array.length === length;
        }

    };

    /***
     * Finds values of nested objects using dot-notation keys
     * @todo deep test
     *
     * @param obj
     * @param key
     * @returns {*}
     */
    function getDotNotationProp (obj, key) {
        var parts = key.split('.');
        while (parts.length && (obj = obj[parts.shift()]));
        return obj;
    }

    /***
     * Tests if obj is equal to query
     * @todo deep test
     *
     * @param obj
     * @param query
     * @returns {boolean}
     */
    function matchArray (obj, query) {
        if (!(obj instanceof Array)) { return false; }
        if (obj.length !== query.length) { return false; }
        for (var i = 0; i < query.length; i++) {
            if (obj[i] !== query[i]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Tests an object against an object query
     * - Does not include regexp and equal tests
     *
     * @param obj
     * @param query
     * @returns {boolean}
     */
    function matchQueryObject (obj, query) {
        for (var key in query) {
            if (query.hasOwnProperty(key)) {
                var fnName = key,
                    value;

                if (fnName in fn) {

                    // runs the match function
                    if (!fn[fnName](obj, query[key], query)) {
                        return false;
                    }

                } else {
                    value = obj[key];
                    if (key.indexOf('.') !== -1) { 
                        value = getDotNotationProp(obj, key);
                    }

                    // recursive run match for an attribute
                    if (!match(value, query[key])) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    /**
     * Tests an object against a mongodb query
     *
     * @param obj
     * @param query
     * @returns {*}
     */
    function match (obj, query) {

        if (query instanceof RegExp) {
            return query.test(obj);
        }

        if (query instanceof Array) {
            return matchArray(obj, query);
        }

        if (typeof query === 'object') {
            return matchQueryObject(obj, query);
        }

        return query === obj;
    }

    // return the match function
    return function (obj) {
        return match(obj, query);
    };
}

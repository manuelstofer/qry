'use strict';

module.exports = createQuery;

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
        if (typeof obj === 'undefined') return true;
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
        if (typeof fn === 'function') {
            fn = 'return (' + fn.toString() + ').call(this);'
        }
        fn = new Function('obj', fn);
        return !!fn.call(obj, obj);
    }

};

function createQuery (query) {
    return function (data) {
        return match(data, query);
    }
}

function isEqualQuery (query) {
    return query instanceof Array || typeof query !== 'object' || query instanceof RegExp;
}

function isEqual (data, query) {

    if (query instanceof RegExp) {
        return query.test(data);
    }

    if (query instanceof Array) {
        if (!(data instanceof Array)) return false;
        if (data.length !== query.length) return false;
        for (var i = 0; i < query.length; i++) {
            if (data[i] !== query[i]) {
                return false;
            }
        }
        return true;
    }
    return query === data;
}

function match (data, query) {

    if (isEqualQuery(query)){
        return isEqual(data, query);
    }

    for (var key in query) {
        var fnName = key;

        if (fnName in fn) {
            if (!fn[fnName](data, query[key], query)) {
                return false;
            }
        } else {
            if (!match(data[key], query[key])) {
                return false;
            }
        }
    }
    return true;
}


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
    }
};

function createQuery (query) {
    return function (data) {
        return match(data, query);
    }
}

function isEqualQuery (query) {
    return query instanceof Array || typeof query !== 'object';
}

function isEqual (data, query) {
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
            if (!fn[fnName](data, query[key])) {
                return false;
            }
        } else {
            if (!(key in data) || !match(data[key], query[key])) {
                return false;
            }
        }
    }
    return true;
}


/*global describe, it, io*/
var chai = require('chai'),
    qry = require('../');
chai.should();

describe('qry', function () {

    it('true when equal', function () {
        var query = qry({hello: 'bla'});
        query({hello: 'bla'}).should.be.true;
    });

    it('false when not equal', function () {
        var query = qry({hello: 'bla'});
        query({hello: 'different'}).should.be.false;
    });

    it('true for equal arrays', function () {
        var query = qry({hello: [1,2,3]});
        query({hello: [1,2,3]}).should.be.true;
    });

    it('false when different arrays', function () {
        var query = qry({hello: [1,2,3]});
        query({hello: [2,3]}).should.be.false;
    });

    it('true for equal with two keys (matching)', function () {
        var query = qry({a: 1, b: 2});
        query({a: 1, b: 2}).should.be.true;
    });

    it('true for correct $gt', function () {
        var query = qry({pi: {$gt: 3}});
        query({pi: Math.PI}).should.be.true;
    });

    it('false for incorrect $gt', function () {
        var query = qry({pi: {$gt: 4}});
        query({pi: Math.PI}).should.be.false;
    });

    it('true for correct $lt', function () {
        var query = qry({pi: {$lt: 4}});
        query({pi: Math.PI}).should.be.true;
    });

    it('false for incorrect $lt', function () {
        var query = qry({pi: {$lt: 3}});
        query({pi: Math.PI}).should.be.false;
    });

    it('true when within $gt $lt range', function () {
        var query = qry({pi: {$gt: 3, $lt: 4}});
        query({pi: Math.PI}).should.be.true;
    });

    it('false when outside $gt $lt range', function () {
        var query = qry({pi: {$gt: 3, $lt: 3.1}});
        query({pi: Math.PI}).should.be.false;
    });

    it('true for correct nested equal test', function () {
        var query = qry({bla: true, nested: {bla: true}});
        query({bla: true, nested: {bla: true}}).should.be.true;
    });

    it('false for incorrect nested equal test', function () {
        var query = qry({bla: true, nested: {bla: true}});
        query({bla: false, nested: {bla: true}}).should.be.false;
        query({bla: true, nested: {bla: false}}).should.be.false;
        query({bla: true, nested: {bla: true}}).should.be.true;
    });

    it('$all', function () {
        var query = qry({numbers: {$all: [5,7]}});
        query({numbers: [1,2,3,5,6,7,10]}).should.be.true;
        query({numbers: [1,2,3,6,7,10]}).should.be.false;
    });

    it('$gte', function () {
        var query = qry({example: {$gte: 1}});
        query({example: 1.1}).should.be.true;
        query({example: 1}).should.be.true;
        query({example: 0.9}).should.be.false;
    });

    it('$in', function () {
        var query = qry({example: {$in: [1,2,3]}});
        query({example: 1}).should.be.true;
        query({example: 1.5}).should.be.false;
    });

    it('$lte', function () {
        var query = qry({example: {$lte: 1}});
        query({example: 1.1}).should.be.false;
        query({example: 1}).should.be.true;
        query({example: 0.9}).should.be.true;
    });

    it('$ne', function () {
        var query = qry({example: {$ne: 1}});
        query({example: 1}).should.be.false;
        query({example: 2}).should.be.true;
    });

    it('$nin', function () {
        var query = qry({example: {$nin: [undefined]}});
        query({}).should.be.true;

        var query = qry({example: {$nin: [1,2,3]}});
        query({example: 2}).should.be.false;
        query({example: 5}).should.be.true;
    });

    it('$and', function () {
        var query = qry({
            $and: [
                {example: {$gt: 3}},
                {example: {$lt: 10}}
            ]
        });
        query({example: 5}).should.be.true;
        query({example: 10}).should.be.false;
    });

    it('$not', function () {
        var query = qry({
            $not: {example: {$lt: 3}}
        });
        query({example: 5}).should.be.true;
        query({example: 2}).should.be.false;
    });

    it('$or', function () {

        var query = qry({
            $or: [
                {example: {$lt: 3}},
                {example: {$gt: 10}}
            ]
        });

        query({example: 11}).should.be.true;
        query({example: 2}).should.be.true;
        query({example: 5}).should.be.false;
    });

    it('$exists', function () {
        var query = qry({
           example: {$exists: true}
        });

        query({example: 11}).should.be.true;
        query({}).should.be.false;

        query = qry({
            example: {$exists: false}
        });

        query({example: false}).should.be.false;
        query({}).should.be.true;

    });

    it('$mod', function () {
        var query = qry({
            example: {$mod: [4, 1]}
        });

        query({example: 5}).should.be.true;
        query({example: 4}).should.be.false;
    });

    it('$regex', function () {
        var query = qry({
            example: {$regex: '^hello', $options: 'i'}
        });

        query({example: 'Hello bla'}).should.be.true;
        query({example: 'hello'}).should.be.true;
        query({example: 'bla'}).should.be.false;
    });

    it('$regex (native)', function () {
        var query = qry({
            example: /^hello/i
        });

        query({example: 'Hello bla'}).should.be.true;
        query({example: 'hello'}).should.be.true;
        query({example: 'bla'}).should.be.false;
    });

    it('$where', function () {
        var query = qry({
            $where: function () { return this.x === 2; }
        });
        query({x: 2}).should.be.true;
        query({x: 3}).should.be.false;
    });

    it('$where (obj)', function () {
        var query = qry({
            $where: function () { return obj.x === 2; }
        });
        query({x: 2}).should.be.true;
        query({x: 3}).should.be.false;
    });

    it('$where (str)', function () {
        var query = qry({
            $where: 'return this.x === 2;'
        });
        query({x: 2}).should.be.true;
        query({x: 3}).should.be.false;
    });

    it('$where (str, obj)', function () {
        var query = qry({
            $where: 'return this.x === 2;'
        });
        query({x: 2}).should.be.true;
        query({x: 3}).should.be.false;
    });

    it('$elemMatch', function () {
        var query = qry({array: { $elemMatch: {value1: 1, value2: {$gt: 1}}}});
        query({array: [{value1: 1, value2: 0}, {value1: 2, value2: 2}]}).should.be.false;
        query({array: [{value1: 1, value2: 0}, {value1: 1, value2: 2}]}).should.be.true;
    });

    it('$size', function () {
        var query = qry({array: {$size: 2}});
        query({array: [1,2]}).should.be.true;
        query({array: [1,2,3]}).should.be.false;
    });

});

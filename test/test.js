/*global describe, it, io*/
'use strict';
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
});

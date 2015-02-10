! function () {
  
  'use strict';

  var should = require('should');

  describe('Query library', function () {

    var Query;

    it ( 'should be a function', function () {
      Query = require('../lib/Query');

      Query.should.be.a.Function;
    });

    it ( 'which is a class', function () {
      Query.prototype.constructor.name.should.eql('Query');
    });

    it ( 'which extends EventEmitter', function () {
      Query.prototype.should.be.an.instanceof(require('events').EventEmitter);
    });

    describe('Query methods', function () {

      it ( 'should have a exec method', function () {
        Query.prototype.exec.should.be.a.Function;
      });

      it ( 'should have a make method', function () {
        Query.prototype.make.should.be.a.Function;
      });

      it ( 'should have a error method', function () {
        Query.prototype.error.should.be.a.Function;
      });

      it ( 'should have a success method', function () {
        Query.prototype.success.should.be.a.Function;
      });

      it ( 'should have a then method', function () {
        Query.prototype.then.should.be.a.Function;
      });

      it ( 'should have a forEach method', function () {
        Query.prototype.forEach.should.be.a.Function;
      });

    });

  });

} ();

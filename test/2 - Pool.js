! function () {
  
  'use strict';

  var should = require('should');

  describe('Pool library', function () {

    var Pool;

    it ( 'should be a function', function () {
      Pool = require('../lib/Pool');

      Pool.should.be.a.Function;
    });

    it ( 'which is a class', function () {
      Pool.prototype.constructor.name.should.eql('Pool');
    });

    it ( 'which extends EventEmitter', function () {
      Pool.prototype.should.be.an.instanceof(require('events').EventEmitter);
    });

    describe('Model methods', function () {

      it ( 'should have a getConnection method', function () {
        Pool.prototype.getConnection.should.be.a.Function;
      });

    });

  });

} ();

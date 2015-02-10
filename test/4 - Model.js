! function () {
  
  'use strict';

  var should = require('should');

  describe('Model library', function () {

    var Model;

    it ( 'should be a function', function () {
      Model = require('../lib/Model');

      Model.should.be.a.Function;
    });

    it ( 'which is a class', function () {
      Model.prototype.constructor.name.should.eql('Model');
    });

    it ( 'which extends EventEmitter', function () {
      Model.prototype.should.be.an.instanceof(require('events').EventEmitter);
    });

    describe('Model methods', function () {

      it ( 'should have a connect method', function () {
        Model.prototype.connect.should.be.a.Function;
      });

      it ( 'should have a create method', function () {
        Model.prototype.create.should.be.a.Function;
      });

      it ( 'should have a find method', function () {
        Model.prototype.find.should.be.a.Function;
      });

      it ( 'should have a insert method', function () {
        Model.prototype.insert.should.be.a.Function;
      });

    });

  });

} ();

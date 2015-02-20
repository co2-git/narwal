! function () {
  
  'use strict';

  var should = require('should');

  describe('[Function Client]', function () {

    var Client;

    it ( 'should be a function', function () {
      Client = require('../lib/Client');

      Client.should.be.a.Function;
    });

    it ( 'which is a class', function () {
      Client.prototype.constructor.name.should.eql('Client');
    });

    it ( 'which extends EventEmitter' , function () {
      Client.prototype.should.be.an.instanceof(require('events').EventEmitter);
    });

    describe ( 'Client methods' , function () {

      it ( 'should have a query method' , function () {
        Client.prototype.query.should.be.a.Function;
      });

    });

  });

} ();

! function () {
  
  'use strict';

  describe ( 'client instance (with a string)' , function () {

    var Client = require('../lib/Client');

    var client;

    var host = 'localhost';

    var user = 'narwal';

    var dbname = 'narwal';

    var should = require('should');

    before(function () {
      client = new Client('mysql://' + user + '@' + host + '/' + dbname);
    });

    it ( 'should have a connection property', function () {
      (client).should.have.property('connection');
      client.connection.constructor.name.should.be.exactly('Connection');
    });

    describe ( 'querying the client' , function () {

      it ( 'should not fail' , function (done) {
        client.query('SELECT 1', function (error, results) {
          if ( error ) {
            return done(error);
          }

          results.should.be.an.Array;
          results.should.eql([ { '1': 1 } ]);
          done();
        });
      });

    });

  });

} ();

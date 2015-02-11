! function () {
  
  'use strict';

  describe ( 'pool instance (with a string)' , function () {

    var Pool = require('../lib/Pool');

    var pool;

    var host = 'localhost';

    var user = 'narwal';

    before(function () {
      pool = new Pool('mysql://' + user + '@' + host);
    });

    it ( 'should emit a connected event' , function (done) {
      pool.on('error', function (error) {
        done(error);
      });

      pool.on('connected', function () {
        done();
      });
    });

    it ( 'should be an instance of Pool', function () {
      (pool)  .should.be.an.instanceof(Pool);
    });

    it ( 'should have an options object', function () {
      (pool)  .should.have.property('options')
              .which.is.an.Object;
    });

    it ( 'host should be ' + host, function () {
      (pool.options)  .should.have.property('host')
                      .which.is.a.String
                      .and.eql(host);
    });

    it ( 'user should be ' + user, function () {
      (pool.options)  .should.have.property('user')
                      .which.is.a.String
                      .and.eql(user);
    });

  });

} ();

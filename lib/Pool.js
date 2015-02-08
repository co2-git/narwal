! function () {
  
  'use strict';

  var mysql = require('mysql');

  function Pool (options) {

    var pool = this;

    this.options = options || {};

    this.connected = false;

    this.on('connected', function () {
      pool.connected = true;
    });

    this.domain = require('domain').create();
    
    this.domain.on('error', function (error) {
      pool.emit('error', error);
    });
    
    this.domain.run(function () {
      
      pool.pool = require('mysql').createPool({
          connectionLimit:          100,
          host:                     options.host,
          user:                     options.user,
          password:                 options.password,
          database:                 options.dbname,
        }, pool.domain.intercept(function () { /* ... */ }));

      pool.pool
      
        .on('error', pool.domain.intercept( function () {} ))

        .on('connection', function () {

        });

      pool.pool.getConnection(pool.domain.bind(function (error) {
        
        if ( error ) {
          if ( error.code === 'ER_BAD_DB_ERROR' ) {
            return console.log('ok, db not exists');
          }

          throw error;
        }

        pool.connected = true;
        pool.emit('connected');

      }));

    });
  }

  require('util').inherits(Pool, require('events').EventEmitter);

  module.exports = Pool;

} ();

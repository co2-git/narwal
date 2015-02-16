! function () {
  
  'use strict';

  var mysql = require('mysql');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function getConnection () {
    var pool = this;

    pool.emit('debug', { 'connecting': pool.options });

    process.nextTick(function () {
      pool
        .pool = require('mysql').createPool({
          connectionLimit:          100,
          host:                     pool.options.host,
          user:                     pool.options.user,
          password:                 pool.options.password,
          database:                 pool.options.dbname,
        }, pool.domain.intercept(function () { /* ... */ }))

        .on('error', pool.domain.intercept( function () {} ))

        .on('connection', function () {})

        .getConnection(pool.domain.bind(function (error) {
          
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

  module.exports = getConnection;

} ();

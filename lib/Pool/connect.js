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
        .pool

        .getConnection(pool.domain.bind(function (error, conn) {
          
          if ( error ) {
            if ( error.code === 'ER_BAD_DB_ERROR' ) {
              return console.log('ok, db not exists');
            }

            throw error;
          }

          console.log(pool.pool)

          pool.connected = true;
          pool.emit('connected', conn);

        }));
    });

    return this;

  }

  module.exports = getConnection;

} ();

! function () {
  
  'use strict';

  var mysql = require('mysql');

  /**
   *  @class Pool
   *  @arg {String|Object?} options
   */

  function Pool (options) {

    // Reference to self

    var pool = this;

    this.options = options || {};

    this.urlString = '';

    if ( typeof options === 'string' ) {
      var parsed = require('url').parse(options);

      this.options = {
        host: parsed.hostname,
        port: parsed.port,
        user: parsed.auth.split(':')[0],
        password: parsed.auth.split(':')[1]
      };
    }

    this.connected = false;

    this.on('connected', function () {
      pool.connected = true;
    });

    this.domain = require('domain').create();
    
    this.domain.on('error', function (error) {
      pool.emit('error', error);
    });

    this.domain.run(this.getConnection.bind(this));
  }

  /**
   *  @extends Pool EventEmitter
   */

  require('util').inherits(Pool, require('events').EventEmitter);

  /**
   *  @method Pool.getConnection
   */

  Pool.prototype.getConnection = function () {
    var pool = this;

    pool.pool = require('mysql').createPool({
        connectionLimit:          100,
        host:                     pool.options.host,
        user:                     pool.options.user,
        password:                 pool.options.password,
        database:                 pool.options.dbname,
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
  };

  module.exports = Pool;

} ();

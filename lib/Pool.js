! function () {
  
  'use strict';

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
        password: parsed.auth.split(':')[1],
        database: parsed.path.split(/\//)[1]
      };
    }

    this.connected = false;

    this.on('connected', function () {
      pool.connected = true;
    });

    this.domain = require('domain').create();
    
    this.domain.on('error', function (error) {
      console.log('pool error', {
        name: error.name,
        message: error.message,
        stack: error.stack.split(/\n/)
      });
      // pool.emit('error', error);
    });


    this.domain.run(function () {

      process.nextTick(function () {
        pool.emit('debug', { 'new Pool()': pool.options, tick: process._tickInfoBox[0] });

        pool
          .pool = require('mysql').createPool({
            connectionLimit:          100,
            host:                     pool.options.host,
            user:                     pool.options.user,
            password:                 pool.options.password,
            database:                 pool.options.database,
          }, pool.domain.intercept(function () { /* ... */ }))

          .on('error', pool.domain.intercept( function () {} ))

          .on('connection', function (conn) {
            pool.conn = conn;
          });
        
        });

      // process.next(function () {

      

      // });

    });
  }

  /**
   *  @extends Pool EventEmitter
   */

  require('util').inherits(Pool, require('events').EventEmitter);

  /**
   *  @method Pool.getConnection
   */

  Pool.prototype.connect = require('./Pool/connect');

  module.exports = Pool;

} ();

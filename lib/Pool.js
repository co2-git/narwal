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

  Pool.prototype.getConnection = require('./Pool/getConnection');

  module.exports = Pool;

} ();

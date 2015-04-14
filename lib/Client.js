! function () {
  
  'use strict';

  var mysql = require('mysql');

  /** @class        Client
   *  @arg          {String} url
   *  @arg          {Object?} options
  */

  function Client (url, options) {

    if ( typeof url !== 'string' ) {
      throw new Error('URL must be a string');
    }

    console.log('got url', url)
    this.construct(url, options);
  
  }

  /** @extends      events.EventEmitter */

  require('util').inherits(Client, require('events').EventEmitter);

  /** @method       Client.construct
   *  @arg          {String} url
   *  @arg          {Object?} options
   *  @return       null
  */

  Client.prototype.construct = function (url, options) {

    /** Default error catcher */

    this.on('error',    function (error) {
      if ( this._events.error.length === 1 ) {
        throw error;
      }
    });

    /** @type             Client */
    var client        =   this;
    
    /** @type             Object */
    this.options      =   options || {};
    
    /** @type             Object */
    var parsed        =   require('url').parse(url);
    
    /** @type             String */
    this.host         =   parsed.hostname;
    
    /** @type             Number */
    this.port         =   parsed.port;
    
    /** @type             String 
        @description      Default database
    */
    this.database     =   'test';

    if ( parsed.path ) {
      this.database   =   parsed.path.split(/\//)[1];
    }

    if ( parsed.auth ) {
      var auth        =   parsed.auth.split(':');

      this.user       =   auth[0];
      this.password   =   auth[1];
    }

    this.reconnecting = 0;
      
    this.connect();

  };

  /** @method       Client.connect
   *  @return       null
  */

  Client.prototype.connect = function () {

    var client = this;

    console.log('connecting to MySQL');

    if ( this.options.pool ) {

    }

    this.connection = mysql.createConnection({
      host        :     this.host,
      port        :     this.port,
      user        :     this.user,
      password    :     this.password,
      database    :     this.database,
    });

    this.connection.on('error', function (error) {
      client.emit('disconnected');

      setTimeout(function () {
        console.log('Reconnecting');
        client.connect();
      }, 1000);
    });

  };

  /** @method       Client.disconnect
   *  @arg          {Function} cb
   *  @return       null
  */

  Client.prototype.disconnect = function (cb) {
    this.connection.end(cb);
  };

  /** @method       Client.query
   *  @arg          {String} statement
   *  @arg          [Object?] params
   *  @arg          {Function} cb
   *  @return       null
  */

  Client.prototype.query = function (statement, params, cb) {
    this.connection.query(statement, params, cb);
  };

  /** Export */

  module.exports = Client;

} ();

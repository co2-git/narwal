! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  var mysql = require('mysql');

  function Client (url) {

    console.log('got url', url)
    this.construct(url);
  
  }

  require('util').inherits(Client, require('events').EventEmitter);

  Client.prototype.construct = function (url) {
    var client = this;

    

    var parsed = require('url').parse(url);

    this.on('error', function (error) {
      console.log('grr');
      if ( this._events.error.length === 1 ) {
        throw error;
      }
    });

    this.host       =   parsed.hostname;
    this.port       =   parsed.port;
    
    this.database   =   'test';

    if ( parsed.path ) {
      this.database   =   parsed.path.split(/\//)[1];
    }

    var auth        =   parsed.auth.split(':');

    this.user       =   auth[0];
    this.password   =   auth[1];

    this.reconnecting = 0;
      
    this.connect();

  };

  Client.prototype.connect = function () {

    var client = this;

    this.connection = mysql.createConnection({
      host        :     this.host,
      port        :     this.port,
      user        :     this.user,
      password    :     this.password,
      database    :     this.database,
    });

    this.connection.on('error', function (error) {

      if ( error.code === 'PROTOCOL_CONNECTION_LOST' ) {
        client.reconnecting ++;

        if ( client.reconnecting < 10 ) {
          setTimeout(client.connect.bind(client), client.connection.config.connectTimeout);
        } 
      }

      else {
        client.emit('error', error);
      }
    });
  };

  Client.prototype.disconnect = function (cb) {
    this.connection.end(cb);
  };

  Client.prototype.query = function (statement, params, cb) {
    this.connection.query(statement, params, cb);
  };

  module.exports = Client;

} ();

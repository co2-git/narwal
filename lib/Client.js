! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

   var mysql = require('mysql');

  function Client (url) {
    var parsed = require('url').parse(url);

    this.on('error', function (error) {
      if ( this._events.error.length === 1 ) {
        throw error;
      }
    });

    this.host       =   parsed.hostname;
    this.port       =   parsed.port;
    this.user       =   parsed.auth.split(':')[0];
    this.password   =   parsed.auth.split(':')[1];
    this.database   =   parsed.path.split(/\//)[1];

    this.connection = mysql.createConnection({
      host:       this.host,
      port:       this.port,
      user:       this.user,
      password:   this.password,
      database:   this.database,
    });
  }

  require('util').inherits(Client, require('events').EventEmitter);

  Client.prototype.query = function (statement, params, cb) {
    this.connection.query(statement, params, cb);
  };

  module.exports = Client;

} ();

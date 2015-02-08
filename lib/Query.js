! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function Query (options) {

    var query = this;

    this.options = options || {};

    this.verb = 'find';

    if ( this.options.insert ) {
      this.verb = 'insert';
    }

    if ( this.options.create === 'table' ) {
      this.verb = 'create table';
    }

    this.domain = require('domain').create();

    this.on('error', function (error) {
      // DO NOT REMOVE - bug endless error
    });
    
    this.domain.on('error', function (error) {
      console.log('query', error, query.constructor.name);
      query.emit('error', error);
    });
  }

  require('util').inherits(Query, require('events').EventEmitter);

  Query.prototype.exec = function () {

    var self = this;

    this.domain.run(function () {
      var query = self.make();

      var conn;

      if ( self.options.pool ) {
        conn = self.options.pool.pool;
      }

      console.log(query.string.bgMagenta);
      console.log(query.params);

      conn.query(query.string, query.params,

        self.domain.intercept(function (results) {

          console.log('ohhhhhhhhhhh')

          var row = self.options.row;

          if ( 'insertId' in results ) {
            row.id = results.insertId;
          }

          if ( self.verb === 'find' ) {
            row = results;
          }

          var emit = ['success', row, results];

          self.emit.apply(self, emit);
        }));
    });

  };

  Query.prototype.make = function () {

    var string = '';
    var params = [];

    switch ( this.verb ) {
      case 'find':
        string += 'SELECT * FROM ??.??';
        params.push(this.options.database, this.options.table);
        break;

      case 'insert':
        string += 'INSERT INTO ??.?? (%s) VALUES(%s)';
        params.push(this.options.database, this.options.table);

        for ( var field in this.options.row ) {
          string = require('util').format(string, '??,%s');
          params.push(field);
        }

        string = string.replace(/,%s/, '');

        for ( var field in this.options.row ) {
          string = require('util').format(string, '?,%s');
          params.push(this.options.row[field]);
        }

        string = string.replace(/,%s/, '');

        break;

      case 'create table':
        string += 'CREATE TABLE ??.?? ( id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, ';
        params.push(this.options.database, this.options.table);

        var type;

        var dataType = '';

        for ( var field in this.options.row ) {

          type = this.options.row[field].type;

          if ( typeof type === 'function' ) {
            switch ( type ) {
              case String:
                dataType = 'VARCHAR(255) NOT NULL';
                break;
            }
          }

          else if ( typeof type === 'string' ) {
            dataType = type + ' NOT NULL';
          }

          string += '?? ' + dataType + ',';
          params.push(field);
        }

        string += ' CREATED timestamp NOT NULL DEFAULT current_timestamp, UPDATED timestamp NOT NULL' ;

        for ( var field in this.options.row ) {

          if ( this.options.row[field].index ) {

            if ( this.options.row[field].index.unique ) {
              string += ', UNIQUE KEY (??)';
              params.push(field);
            }

          }

        }

        string += ') ENGINE=INNODB DEFAULT CHARACTER SET utf8;';

        break;
    }

    return {
      string: string,
      params: params
    };
  };

  Query.prototype.error = function (fn) {
    this.on('error', fn);
  };

  Query.prototype.success = function (fn) {
    this.on('success', fn);
  };

  Query.prototype.then = function (fn1, fn2) {
    this.on('success', fn1);

    if ( typeof fn2 === 'function' ) {
      this.on('error', fn2);
    }
  };

  Query.prototype.forEach = function (fn) {
    this.on('success', function (rows) {
      if ( Array.isArray(rows) ) {
        rows.forEach(fn);
      }
    });
  };

  module.exports = Query;

} ();

! function () {
  
  'use strict';

  var Query = require('./Query');
  var Pool = require('./Pool');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function Model (name, schema) {

    var model = this;

    this.name = name;

    this.table = this.name.toLowerCase() + 's';

    this.schema = schema || {};

    this.connected = false;

    this.domain = require('domain').create();
    
    this.domain.on('error', function (error) {
      model.emit('error', error);
    });
  }

  require('util').inherits(Model, require('events').EventEmitter);

  Model.prototype.connect = function(url) {

    var model = this;

    this.host = 'localhost';
    this.user = 'root';
    this.password = 'mysql1981';
    this.database = 'test2';

    this.pool = new Pool(this);

    this.retries = 0;

    this.pool.on('connected', function  () {
      model.emit('connected');
    });

    this.pool.on('error', function  (error) {
      model.emit('error', error);
    });

    return this;
  };

  Model.prototype.create = function () {
    var model = this;

    var query;

    model.domain.run(function () {
      query = new Query({
        pool:         model.pool,
        database:     model.database,
        table:        model.table,
        create:       'table',
        row:          model.schema
      });

      process.nextTick(function () {

        if ( model.pool.connected ) {
          query.exec();
        }

        else {
          model.pool.on('connected', function () {
            query.exec();
          });
        }

      });
    });

    return query;
  };

  Model.prototype.find = function () {

    var model = this;

    var query = new Query({ pool: this.pool, database: this.database, table: 'adresses' });

    query.on('error', function (error) {
      model.emit('error', error);
    });

    process.nextTick(function () {

      if ( model.pool.connected ) {
        query.exec();
      }

      else {

        // model.connect();

        model.on('connected', function () {
          query.exec();
        });

      }

    });

    return query;
  };

  Model.prototype.insert = function (row) {

    var model = this;

    var query;

    model.domain.run(function () {
      var defaultRow = {
        
      };

      for ( var field in row ) {
        defaultRow[field] = row[field];
      }

      for ( field in this.schema ) {
        if ( model.schema[field].default ) {
          if ( typeof model.schema[field].default === 'function' ) {
            defaultRow[field] = model.schema[field].default(defaultRow[field]);
          }
          else {
            defaultRow[field] = model.schema[field].default;
          }
        }
      }

      for ( field in model.schema ) {
        if ( model.schema[field].required && ( ! ( field in defaultRow ) ) ) {
          throw new Error('Missing required field `' + field + '`');
        }
      }

      query = new Query({
        pool:         model.pool,
        database:     model.database,
        table:        model.table,
        insert:       true,
        row:          defaultRow
      });

      query.on('error', function (error) {
        model.emit('error', error);
      });

      process.nextTick(function () {

        if ( model.pool.connected ) {
          query.exec();
        }

        else {

          // model.connect();

          model.on('connected', function () {
            query.exec();
          });

        }

      });
    }); 

    return query;
  };

  module.exports = Model;

} ();

! function () {
  
  'use strict';

  var Query;

  /**
   *  @class Model
   *  @arg {string} name
   *  @arg {Object?} schema
   */

  function Model (name, schema) {

    Query   =   require('./Query');

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

  /**
   *  @method Model.connect
   */

  Model.prototype.connect = require('./Model/connect');

  /**
   *  @method Model.create
   */

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

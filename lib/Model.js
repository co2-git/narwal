! function () {
  
  'use strict';

  var Query = require('./Query');

  var Narwal = require('./Narwal');

  /**
   *  @class Model
   *  @arg {string} name
   *  @arg {Object?} schema
   */

  function Model (name, schema) {

    // Reference to self

    var model = this;

    // Catch errors to avoid maximum call stack

    this.on('error', function () {});

    // Debug message - in next tick to be heard by listeners

    process.nextTick(function () {
      model.emit('debug',
        { 'new Model()': { name: name, schema: schema, tick: process._tickInfoBox[0] } });
    });

    /** @type String */

    this.name = name;

    /** @type String */

    this.table = this.name.toLowerCase() + 's';

    /** @type Object? */

    this.schema = schema || {};

    this.connected = false;

    this.connecting = false;

    this.on('connected', function () {
      model.connected = true;
      model.database = model.connexion.options.dbname;
    });

    /** @type Domain */

    this.domain = require('domain').create();

    // On domain error
    
    this.domain.on('error', function (error) {
      model.emit('error', error);
    });
  }

  /** @extends events.EventEmitter */

  require('util').inherits(Model, require('events').EventEmitter);

  /**
   *  @method Model.connect
   */

  Model.prototype.connect = require('./Model/connect');

  /**
   *  @method Model.create
   *  @return Query
   */

  Model.prototype.create = require('./Model/create');

  /**
   *  @method Model.find
   *  @return Query
   */

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

  /**
   *  @method Model.insert
   *  @return Query
   *  @arg {Row || [Row]}? row
   */

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

! function () {
  
  'use strict';

  module.exports = Model;

  var Structure = require('./Structure');

  /**
   *  @class      Model
   *  @arg        {string} name
   *  @arg        {Object?} structure
   */

  function Model (name, structure, options) {

    options = options || {};

    // Reference to self

    var model = this;

    /** @type String */

    this.name = name;

    if ( options.table ) {
      this.table = options.table;
    }

    /** @type Object? */

    this.structure = new Structure(structure || {});

    /** @type Domain */

    this.domain = require('domain').create();

    // Catch errors to avoid maximum call stack

    this.on('error', function (error) {
      if ( this._events.error.length === 1 ) {
        throw error;
      }
    });

    // On domain error
    
    this.domain.on('error', function (error) {
      model.emit('error', error);
    });
  }

  /** @extends events.EventEmitter */

  require('util').inherits(Model, require('events').EventEmitter);

  // Prototypes

  Model.prototype.connect       =   require('./Model/connect');

  Model.prototype.create        =   require('./Model/create');

  Model.prototype.find          =   require('./Model/find');

  Model.prototype.findOne       =   require('./Model/find-one');

  Model.prototype.insert        =   require('./Model/insert');

  Model.prototype.tableName     =   require('./Model/table-name');

} ();

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

    this.construct(name, structure, options);

  }

  /** @extends events.EventEmitter */

  require('util').inherits(Model, require('events').EventEmitter);

  // Prototypes

  Model.prototype.construct = function (name, structure, options) {
    options = options || {};

    // Reference to self

    var model = this;

    /** @type String */

    this.name = name;

    // Table name

    if ( options.table ) {
      this.table = options.table;
    }

    /** @type Object? */

    this.structure = new Structure(structure || {});

    /** Implicit fields */

    this.implicit = {
      id: true,
      created: ('created' in options) ? options.created : false,
      updated: ('updated' in options) ? options.updated : false,
      revision: ('revision' in options) ? options.revision : false
    };

    /** Model version */

    this.version = 'version' in options ? options.version : 0;

    /** Pluralize */

    this.pluralize = 'pluralize' in options ? options.pluralize : true;

    /** Multi columns indexes */

    this.indexes = {};    

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
  };

  Model.prototype.connect       =   require('./Model/connect');

  Model.prototype.create        =   require('./Model/create');

  Model.prototype.find          =   require('./Model/find');

  Model.prototype.findOne       =   require('./Model/find-one');

  Model.prototype.insert        =   require('./Model/insert');

  Model.prototype.join          =   require('./Model/join');

  Model.prototype.tableName     =   require('./Model/table-name');

  Model.prototype.after         =   function (action, then) {
    return this;
  };

} ();

! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function Query (model) {

    var query = this;

    this.model = model;

    this.verb = 'find';

    this.string = '';

    this.params = [];

    this.options = {
      limit: 1000,
      skip: 0
    };

    this.data = [];

    this.filters = [];

    this.domain = require('domain').create();

    this.on('error', function (error) {
      console.log('on query error', error.stack.split(/\n/))
      if ( this._events.error.length === 1 ) {
        throw error;
      }
    });
    
    this.domain.on('error', function (error) {
      console.log('query', error, query.constructor.name);
      query.emit('error', error);
    });

    process.nextTick(function () {
      // query['_' + query.verb]();

    });
  }

  require('util').inherits(Query, require('events').EventEmitter);

  Query.prototype.exec        =     require('./Query/exec');

  Query.prototype._create     =     require('./Query/_create');

  Query.prototype.create      =     require('./Query/create');

  Query.prototype._find       =     require('./Query/_find');

  Query.prototype.find        =     require('./Query/find');

  Query.prototype.insert      =     require('./Query/insert');

  Query.prototype._insert     =     require('./Query/_insert');

  Query.prototype.limit = function  (number) {
    this.options.limit = number;
    return this;
  };

  Query.prototype.error       =     function (fn) {
    this.on('error', fn);

    return this;
  };

  Query.prototype.success     =     function (fn) {
    this.on('success', fn);

    return this;
  };

  Query.prototype.then        =     function (fn1, fn2) {
    this.on('success', fn1);

    if ( typeof fn2 === 'function' ) {
      this.on('error', fn2);
    }

    return this;
  };

  Query.prototype.forEach     =     function (fn) {
    this.on('success', function (rows) {
      if ( Array.isArray(rows) ) {
        rows.forEach(fn);
      }
    });

    return this;
  };

  module.exports = Query;

} ();

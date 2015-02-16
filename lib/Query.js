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

    process.nextTick(function () {
      query.emit('debug', { 'new Query()': {
        options: query.options,
        verb: query.verb, tick: process._tickInfoBox[0]
      }})
    });
  }

  require('util').inherits(Query, require('events').EventEmitter);

  Query.prototype.exec = require('./Query/exec');

  Query.prototype.make = require('./Query/make');

  Query.prototype.error = function (fn) {
    this.on('error', fn);

    return this;
  };

  Query.prototype.success = function (fn) {
    this.on('success', fn);

    return this;
  };

  Query.prototype.then = function (fn1, fn2) {
    this.on('success', fn1);

    if ( typeof fn2 === 'function' ) {
      this.on('error', fn2);
    }

    return this;
  };

  Query.prototype.forEach = function (fn) {
    this.on('success', function (rows) {
      if ( Array.isArray(rows) ) {
        rows.forEach(fn);
      }
    });

    return this;
  };

  module.exports = Query;

} ();

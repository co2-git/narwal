! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function Structure (structure) {

    var self = this;

    Object.keys(structure).forEach(function (field) {

      this[field] = { type: String };

      // Type

      // { "field": Function } or { "field": Model } or { "field": String }

      if ( typeof structure[field] === 'function' || structure[field] instanceof require('./Model') || typeof structure[field] === 'string' ) {
        this[field].type = structure[field];
      }

      // { "field": { "type": Function } } or { "field": { "type": Model } } or { "field": { "type": String } }

      else if ( typeof structure[field].type === 'function' || structure[field].type instanceof require('./Model') || typeof structure[field].type === 'string' ) {
        this[field].type = structure[field].type;
      }

      // Authorized fields

      [
        'required',
        'default',
        'validate',
        'null',
        'default',
        'unique',
        'unique-with',
        'index',
        'index-with',
        'comment'
      ]
        .forEach(function (attr) {

          if ( attr in structure[field] ) {
            self[field][attr] = structure[field][attr];
          }

        });

    }.bind(this));
  }

  module.exports = Structure;

} ();

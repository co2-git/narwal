! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function Structure (structure) {

    Object.keys(structure).forEach(function (field) {

      this[field] = {};

      // Type

      // { field: Type }

      if ( typeof structure[field] === 'function' ) {
        this[field].type = structure[field];
      }

      // { field: { type: Type } }

      else if ( typeof structure[field].type === 'function' ) {
        this[field].type = structure[field].type;
      }

      // Required

      if ( 'required' in structure[field] ) {
        this[field]['required'] = structure[field]['required'];
      }

      // Default

      if ( 'default' in structure[field] ) {
        this[field]['default'] = structure[field]['default'];
      }

      // Validate

      if ( 'validate' in structure[field] ) {
        this[field]['validate'] = structure[field]['validate'];
      }

      // NULL values

      if ( 'null' in structure[field] ) {
        this[field]['null'] = structure[field]['null'];
      }

    }.bind(this));
  }

  module.exports = Structure;

} ();

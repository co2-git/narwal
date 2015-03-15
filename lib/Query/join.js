! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function join () {

    for ( var i in arguments ) {
      if ( typeof arguments[i] === 'string' && (arguments[i] in this.model.structure) ) {
        this.joined.push(arguments[i]);
      }

      if ( typeof arguments[i] === 'object' && ( Object.keys(arguments[i])[0] in this.model.structure ) ) {
        this.joined.push(arguments[i]);
      }
    }

    return this;
  }

  module.exports = join;

} ();

! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function create (options) {

    if ( typeof options === 'object' ) {
      for ( var key in options ) {
        this.options[key] = options[key];
      }
    }

    this.verb = 'create';

    return this;
  }

  module.exports = create;

} ();

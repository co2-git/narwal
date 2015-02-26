! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function find (filter) {
    this.verb = 'find';

    if ( typeof filter === 'number' ) {
      this.limit = filter;
    }

    else if ( typeof filter === 'object' ) {
      this.filters.push(filter);
    }

    return this;
  }

  module.exports = find;

} ();

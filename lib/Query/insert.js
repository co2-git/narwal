! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function insert (rows) {

    if ( Array.isArray(rows) ) {
      this.data = this.data.concat(rows);
    }

    else {
      this.data.push(row);
    }

    this.verb = 'insert';
  }

  module.exports = insert;

} ();

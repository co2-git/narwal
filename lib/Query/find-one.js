! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function findOne () {

    this.verb = 'find';

    this.one = true;

    this.string += 'SELECT * FROM ??';

    this.params.push(this.model.table || this.model.tableName());
  }

  module.exports = findOne;

} ();

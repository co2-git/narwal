! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function tableName (options) {

    options = options || {};

    if ( ! ( 'pluralize' in options ) && 'pluralize' in this ) {
      options.pluralize = this.pluralize;
    }

    var name = this.name;

    var lower = true;
    var pluralize = 'pluralize' in options ? options.pluralize : true;

    if ( lower ) {
      name = name.toLowerCase();
    }

    if ( pluralize ) {
      name += 's';
    }

    return name;
  }

  module.exports = tableName;

} ();

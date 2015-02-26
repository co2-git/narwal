! function () {
  
  'use strict';

  var is = require('../Is');

  // process.exit(0);

  /**
   *  @function
   *  @return
   *  @arg
   */

  function find () {

    var query = this;

    this.string += 'SELECT id, {fields} FROM ?? %s LIMIT %d, %d';

    this.string = this.string.replace(/\{fields\}/,

      Object.keys(this.model.structure).map(function (field) {

        query.params.push(field);

        return '??';

      }).join(', '));

    this.params.push(this.model.table || this.model.tableName());

    if ( this.filters.length ) {
      var where = 'WHERE %s';

      var conditions = [];

      this.filters.forEach(function (filter) {

        for ( var field in filter ) {
          var operator = '=';

          var value = filter[field];

          var token = '?';

          if ( value instanceof is ) {
            if ( value.valueIsAField ) {
              token = '??';
            }

            operator  =   value.operator;
            value     =   value.value;
          }

          if ( value instanceof RegExp ) {

            if ( operator.indexOf('!') === -1 ) {
              operator = 'REGEXP';
            }

            else {
              operator = 'NOT REGEXP';
            }

            value = value.toString().replace(/^\/|\/$/g, '');
          }

          conditions.push('?? ' + operator + ' ' + token);
          
          query.params.push(field, value);
        }
      });

      where = require('util').format(where, conditions.join(' AND '));

      this.string = require('util').format(this.string, where);
    }

    else {
      this.string = require('util').format(this.string, '');
    }

    this.string = require('util').format(this.string, this.options.skip, this.options.limit);
  }

  module.exports = find;

} ();

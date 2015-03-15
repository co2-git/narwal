! function () {
  
  'use strict';

  var is = require('../Is');

  // process.exit(0);

  /**
   *      @method Query.find
   *      @return null
  **/

  function find () {

    var query = this;

    function selectDistantField (field, model) {
      for ( var foreign in field ) {

        if ( typeof field[foreign] === 'string' ) {
          var ref = model.structure[foreign].type;
          var link = ref.structure[field[foreign]].type;

          var linkTable = link.table || link.tableName();
          
          for ( var key in link.structure ) {
            fields.push('??.?? AS ?');

            query.params.push(linkTable, key, linkTable + '.' + key);
          }
        }

        else if ( typeof field[foreign] === 'object' ) {
          selectDistantField(field[foreign], model.structure[foreign].type);
        }

      }
    }

    function joinDistantTable (field, model) {
      for ( var foreign in field ) {
        
        if ( typeof field[foreign] === 'string' ) {
          join += ' JOIN ?? ON ??.??= ??.??';

          var ref = model.structure[foreign].type;
          var link = ref.structure[field[foreign]].type;

          var linkTable = link.table || link.tableName();
          var refTable = ref.table || ref.tableName();

          query.params.push(linkTable, linkTable, 'id', refTable, foreign);
        }

        else {
          joinDistantTable(field[foreign], model.structure[foreign].type);
        }
      }
    }

    /**   Table name
     *
     *    @type String
    */

    var table = this.model.table || this.model.tableName();

    /**   Query Statement
     *
     *    @type String
    */

    this.statement = 'SELECT {fields} FROM ?? %s LIMIT %d, %d';

    /**   Select fields
     *
     *    @type [String]
    */

    var fields = ['??.?? AS ?'];

    this.params.push(table, 'id', table + '.id');

    fields = fields.concat(Object.keys(this.model.structure).map(function (field) {

      query.params.push(table, field, table + '.' + field);

      return '??.?? AS ?';

    }));

    /**   Select fields from joined table
     *
     *    
    */

    if ( this.joined.length ) {
      this.joined.forEach(function (field) {

        if ( typeof field === 'string' ) {
          var ref = query.model.structure[field].type;

          var table = ref.table || ref.tableName();

          for ( var key in ref.structure ) {
            fields.push('??.?? AS ?');

            query.params.push(table, key, table + '.' + key);
          }
        }

      });

      this.joined.forEach(function (field) {

        if ( typeof field === 'object' ) {
          selectDistantField(field, query.model);
        }

      });
    }

    /**   
     *    Populate fields in statement
     *    
    **/

    this.statement = this.statement.replace(/\{fields\}/, fields.join(', '));

    /**   
     *    Populate table in statement
     *    
    **/

    this.params.push(table);

    /**   
     *    Populate join tables in statement
     *    
    **/

    if ( this.joined.length ) {

      var join = '';

      this.joined.forEach(function (field) {
        
        if ( typeof field === 'string' ) {
          var ref = query.model.structure[field].type;

          join += ' JOIN ?? ON ??.?? = ??.??';

          var ref_table = ref.table || ref.tableName();

          query.params.push(ref_table, table, field, ref_table, 'id');
        }
      });

      this.joined.forEach(function (field) {
        
        if ( typeof field === 'object' ) {
          joinDistantTable(field, query.model);
        }
      });

      this.statement = require('util').format(this.statement, join + ' %s');
    }

    /**   
     *    Populate where in statement
     *    
    **/

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

          conditions.push('??.?? ' + operator + ' ' + token);
          
          query.params.push(table, field, value);
        }
      });

      where = require('util').format(where, conditions.join(' AND '));

      this.statement = require('util').format(this.statement, where);
    }

    else {
      this.statement = require('util').format(this.statement, '');
    }

    this.statement = require('util').format(this.statement, this.options.skip, this.options.limit);
  }

  module.exports = find;

} ();

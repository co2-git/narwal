! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function insert () {

    var query = this;

    var structureFields = Object.keys(this.model.structure);

    var fields = [];

    if ( ! this.data.length ) {
      this.data.push({ id: null });
    }

    this.data.forEach(function (data) {

      for ( var field in data ) {
        if ( fields.indexOf(field) === -1 ) {
          
          if ( structureFields.indexOf(field) !== -1 ) {
            fields.push(field)
          }

        }
      }

    });

    if ( this.model.implicit.created ) {
      fields.push('_created');
    }

    if ( this.model.implicit.updated ) {
      fields.push('_updated');
    }

    if ( this.model.implicit.revision ) {
      fields.push('_revision');
    }

    console.log('fields', fields);

    /** Initial statement */

    this.statement = 'INSERT INTO ?? ({fields}) VALUES {values}';

    /** Table name */

    this.params.push(this.model.table || this.model.tableName());

    /** Fields **/

    this.statement = this.statement.replace(/\{fields\}/,
      fields.map(function (field) {
        
        query.params.push(field);

        return '??';

      }).join(', '));

    /** Values */

    this.statement = this.statement.replace(/\{values\}/,
      
      this.data.map(
      
        function rowValues (row) {

          var values = [];

          values = values.concat(fields.map(function (field) {

            var value = null;

            if ( field in row ) {
              value = row[field];
            }

            else {

              if ( field === '_created' && query.model.implicit.created ) {
                value = null;
              }

              else if ( field === '_updated' && query.model.implicit.updated ) {
                value = null;
              }

              else if ( field === '_revision' && query.model.implicit.revision ) {
                value = query.model.version;
              }

            }
            
            query.params.push(value);

            return '?';

          }));

          /** Implicit values */

          // if ( query.model.implicit.created ) {
          //   values.push('?');
          //   query.params.push(null);
          // }

          // if ( query.model.implicit.updated ) {
          //   values.push('?');
          //   query.params.push(null);
          // }

          // if ( query.model.implicit.revision && ('version' in query.model) ) {
          //   values.push('?');
          //   query.params.push(query.model.version);
          // }

          return '( ' + values.join(', ') + ' )';
          
        }

      ).join(', '));

    console.log(this.statement);
  }

  module.exports = insert;

} ();

! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function insert () {

    var query = this;

    console.log('data', this.data)

    var structureFields = Object.keys(this.model.structure);

    console.log('structureFields', structureFields)

    var fields = [];

    this.data.forEach(function (data) {

      for ( var field in data ) {
        if ( fields.indexOf(field) === -1 ) {
          
          if ( structureFields.indexOf(field) !== -1 ) {
            fields.push(field)
          }

        }
      }

    });

    console.log('fields', fields);

    this.string += 'INSERT INTO ?? (created, updated, {fields}) VALUES {values}';

    this.params.push(this.model.table || this.model.tableName());

    this.string = this.string.replace(/\{fields\}/,
      fields.map(function (field) {
        
        query.params.push(field);

        return '??';

      }).join(', '));

    this.string = this.string.replace(/\{values\}/,
      
      this.data.map(
      
        function rowValues (row) {

          var values = ['?', '?'];

          query.params.push(null, null);

          values = values.concat(fields.map(function (field) {

            var value;

            if ( field in row ) {
              value = row[field];
            }

            else {

            }
            
            query.params.push(row[field] || null);

            return '?';

          }));

          return '( ' + values.join(', ') + ' )';
          
        }

      ).join(', '));

    console.log(this.string);
  }

  module.exports = insert;

} ();

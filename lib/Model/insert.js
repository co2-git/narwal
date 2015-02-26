! function () {
  
  'use strict';

  var Query = require('../Query');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function insert (rows) {

    var model = this;

    var structure = this.structure;

    var query = new Query(model);

    model.domain.run(function () {

      process.nextTick(function () {

        if ( ! Array.isArray(rows) ) {
          rows = [rows];
        }

        rows = rows.map(function (row) {

          var build = {};

          for ( var field in structure ) {

            if ( field in row ) {
              build[field] = row[field];
            }

            // Default

            if ( structure[field].default && ! ( field in build ) ) {

              if ( typeof structure[field].default === 'function' ) {
                build[field] = structure[field].default();
              }

              else {
                build[field] = structure[field].default;
              }

            }

            // Required

            if ( structure[field].required && ! ( field in build ) ) {

              throw new Error('Missing required field: ' + field);

            }

            // Validate

            if ( typeof structure[field].validate === 'function' ) {

              if ( ! structure[field].validate(build[field] ) ) {
                throw new Error('Invalid field value for field ' + field);
              }

            }

          }

          return build;

        });

        query.insert(rows);

        if ( model.client ) {

          query.exec(model.client);

        }

        else {
          
          model.on('client', query.exec.bind(query));
        
        }

      });
    }); 

    return query;
  }

  module.exports = insert;

} ();

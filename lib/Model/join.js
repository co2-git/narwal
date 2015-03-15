! function () {
  
  'use strict';

  var Query = require('../Query');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function join (field) {

    var model = this;

    var query = new Query(model);

    model.domain.run(function () {

      process.nextTick(function () {

        query.join(field);

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

  module.exports = join;

} ();

! function () {
  
  'use strict';

  var Query = require('../Query');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function find (filter) {

    var model = this;

    var query = new Query(model);

    model.domain.run(function () {

      process.nextTick(function () {

        query.find(filter);

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

  module.exports = find;

} ();

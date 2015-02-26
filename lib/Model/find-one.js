! function () {
  
  'use strict';

  var Query = require('../Query');

  var Narwal = require('../Narwal');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function findOne (filter) {

    var model = this;

    var query = new Query(model);

    model.domain.run(function () {

      process.nextTick(function () {

        query.find(filter).limit(1);

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

  module.exports = findOne;

} ();

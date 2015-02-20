! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

   var Query = require('../Query');

  function create () {

    var model = this;

    var query = new Query(model);

    query.on('error', function (error) {
      model.emit('error', error);
    });

    query.on('debug', function (debug) {
      model.emit('debug', debug);
    });

    model.domain.run(function () {

      process.nextTick(function () {

        model.emit('debug', { 'Model.create()': model.schema, 'client': model.client, tick: process._tickInfoBox[0] });

        query.create();

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

  module.exports = create;

} ();

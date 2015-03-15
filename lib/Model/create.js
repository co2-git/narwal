! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

   var Query = require('../Query');

  function create (options, cb) {

    if ( typeof options === 'function' && ! cb ) {
      cb = options;
      options = {};
    }

    options = options || {};

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

        query.create(options);

        if ( typeof cb === 'function' ) {
          query
            .error(cb)
            .success(function (results, stats) {
              cb(null, results, stats);
            });
        }

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

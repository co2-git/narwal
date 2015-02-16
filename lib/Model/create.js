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

    var query;

    model.domain.run(function () {

      process.nextTick(function () {

        model.emit('debug', { 'Model.create()': model.schema, 'conn': model.conn, tick: process._tickInfoBox[0] });

        query = new Query({
          conn:         model.conn,
          table:        model.table,
          create:       'table',
          row:          model.schema
        });

        query.on('error', function (error) {
          model.emit('error', error);
        });

        query.on('debug', function (debug) {
          model.emit('debug', debug);
        });

        query.exec();

      });
    });

    return query;
  }

  module.exports = create;

} ();

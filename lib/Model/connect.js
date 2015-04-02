! function () {
  
  'use strict';

  var Client = require('../Client');

  /**
   *  @method Model.connect
   *  @return Model
   */

  function connect (url) {

    console.log(url, url.constructor.name);

    // Reference to self

    var model             =   this;

    process.nextTick(function () {
      if ( url instanceof Client ) {
        model.client = url;
      }

      else {
        model.client = new Client(url);
      }

      model.emit('client', model.client);
    });

    return this;
  }

  module.exports = connect;

} ();

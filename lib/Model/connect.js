! function () {
  
  'use strict';

  var Pool = require('../Pool');

  /**
   *  @method Model.connect
   *  @return Model
   */

  function connect (url) {

    // Reference to self

    var model       =   this;

    this.pool       =   new Pool(url);

    this.retries = 0;

    this.pool.on('connected', function  () {
      model.emit('connected');
    });

    this.pool.on('error', function  (error) {
      model.emit('error', error);
    });

    return this;
  }

  module.exports = connect;

} ();

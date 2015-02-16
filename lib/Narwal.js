! function () {
  
  'use strict';

  var Pool = require('./Pool');

  /**
   *  @class
   *  @arg
   */

  function Narwal () {
    // ... body
  }

  Narwal.Model = require('./Model');

  Narwal.connect = function (url) {
    Narwal.connection = new Pool(url);

    Narwal.connecting = true;

    return Narwal.connection;
  }

  module.exports = Narwal;

} ();

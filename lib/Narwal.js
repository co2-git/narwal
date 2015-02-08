! function () {
  
  'use strict';

  /**
   *  @class
   *  @arg
   */

  function Narwal () {
    // ... body
  }

  Narwal.factory = function () {
    return new Narwal();
  };

  Narwal.Model = require('./Model');

  module.exports = Narwal;

} ();

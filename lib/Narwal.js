! function () {
  
  'use strict';

  /**
   *  @class Narwal
   *  @description Container
   */

  function Narwal () {}

  Narwal.Model        =     require('./Model');
  Narwal.Client       =     require('./Client');
  Narwal.is           =     require('./Is');

  module.exports      =       Narwal;

} ();

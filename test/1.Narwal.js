! function () {
  
  'use strict';

  var should = require('should');

  describe('Narwal library', function () {

    var Narwal;

    it ( 'should be a function', function () {
      Narwal = require('../lib/Narwal');

      Narwal.should.be.a.Function;
    });

    it ( 'should have a static function called Model', function () {

      Narwal.Model.should.be.a.Function;

    });

  });

} ();

! function () {
  
  'use strict';

  describe ( 'model instance' , function () {

    var narwal = require('../');

    var model;

    before(function () {
      model = new narwal.Model('Narwal_test');
    });

    it ( 'should be an instance of Model', function () {
      model.should.be.an.Object;
    });

  });

} ();

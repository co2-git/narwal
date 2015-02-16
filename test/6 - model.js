! function () {
  
  'use strict';

  describe ( 'model instance' , function () {

    var narwal = require('../');

    narwal.connect('mysql://narwal@localhost/narwal');

    var Model;

    before(function () {
      Model = new narwal.Model('Narwal_test', {
        name: String
      });
    });

    it ( 'should be an instance of Model' , function () {
      Model.should.be.an.Object;
    });

    describe ( 'create()' , function () {

      var row;

      before(function  (done) {
        Model.create()
          .error(done)
          .success(function (test) {
            console.log(test)
            row = test;
          });
      });

      it ( 'should be an object' , function () {

      });

    });

  });

} ();

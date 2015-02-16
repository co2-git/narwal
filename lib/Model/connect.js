! function () {
  
  'use strict';

  var Pool = require('../Pool');

  /**
   *  @method Model.connect
   *  @return Model
   */

  function connect (url) {

    // Reference to self

    var model             =   this;

    process.nextTick(function () {

      model.emit('debug', { 'Model.connect()': {tick: process._tickInfoBox[0]} });

      model.connecting       =   true;

      model.connexion        =   new Pool(url);

      model.connexion.on('debug', function (debug) {
        model.emit('debug', debug);
      });

      model.connexion.on('connected', function  () {
        model.connecting = false;
        model.emit('connected');
      });

      model.connexion.on('error', function  (error) {
        model.connecting = false;
        model.emit('error', error);
      });

      process.nextTick(function () {
        model.connexion.getConnection();
      });

    });

    return this;
  }

  module.exports = connect;

} ();

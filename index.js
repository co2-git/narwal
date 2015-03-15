! function () {
  
  'use strict';

  /** MODEL **/

  exports.models = {};

  function Model (name, structure, options) {
    this.construct(name, structure, options);
    exports.models[name] = this;
  }

  require('util').inherits(Model, require('./lib/Model'));

  exports.Model = Model;

  /** CLIENT **/

  exports.clients = [];

  function Client (url) {
    this.construct(url);
    exports.clients.push(this);
  }

  require('util').inherits(Client, require('./lib/Client'));

  exports.Client = Client;

} ();

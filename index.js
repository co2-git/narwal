function Narwal () {

  var narwal = this;

  this.host = 'localhost';

  this.port = 3306;

  this.user = 'root';

  this.password = false;

  this.dbname = 'test';

  this.connected = true;

  this.models = [];

  this.on('connected', function () {
    narwal.connected = true;
  });

  this.domain = require('domain').create();
  
  this.domain.on('error', function (error) {
    narwal.emit('error', error);
  });

}

require('util').inherits(Narwal, require('events').EventEmitter);

Narwal.prototype.connect = function (info) {
  
  var narwal = this;

  badge = badge || {};

  this.host = badge.host || this.host;
  this.port = badge.port || this.port;
  this.user = badge.user || this.user;
  this.password = badge.password || this.password;
  this.dbname = badge.dbname || this.dbname;

  narwal.domain.run(function () {
    narwal.pool = require('mysql').createPool({
        connectionLimit:          100,
        host:                     narwal.host,
        user:                     narwal.user,
        password:                 narwal.password,
        database:                 narwal.dbname,
      }, narwal.domain.intercept(function () {
        console.log(arguments);
      }));

    narwal.pool
      
      .on('error', narwal.domain.intercept( function () {} ))

      .on('connection', function () {
        narwal.emit('connected');
      });

    narwal.pool.getConnection(narwal.domain.bind(function (error) {
      
      if ( error ) {
        if ( error.code === 'ER_BAD_DB_ERROR' ) {
          return console.log('ok, db not exists');
        }

        throw error;
      }

    }));
  });

};

Narwal.prototype.insert = function () {

  var narwal = this;

  var query = new require('events').EventEmitter();

  if ( ! narwal.connected ) {
    narwal.on('connected', function () {
      query = narwal.insert();
    });

    return query;
  }

  narwal.pool.query('INSERT t INTO ')

};

Narwal.prototype.model = function (model) {

  var Model = new Narwal.Model(model, {
    info: 
  });

  this.models.push(Model);

  return Model;
};



Narwal.Model = function (name, options) {

  this.options = options || {};

  this.name = name;
};

Narwal.Model.prototype.structure = function (structure) {
  // body...
};

Narwal.Model.prototype.insert = function () {

  var model = this;

  var query = new Narwal.Query('insert');

  process.nextTick(function () {

    if ( )

    query.exec();
  });

  return query;
};

Narwal.Query = function (verb) {
  this.verb = verb;
};

require('util').inherits(Narwal.Query, require('events').EventEmitter);

Narwal.Query.prototype.error = function () {
  return this;
};

Narwal.Query.prototype.success = function () {
  return this;
};

Narwal.Query.prototype.exec = function () {
  var query = '';

  switch ( this.verb.toLowerCase() ) {
    case 'insert':
      query = 'INSERT INTO';
      break;
  }

  console.log(query)
};

// var schema = {};

// var model = new Narwal();

// model.on('error', function (error) {
//   throw error;
// });

// model.connect({
//   password: 'mysql1981'
// });

// model.insert();

var narwal = new Narwal();

var Adresse = narwal.model('Adresse');

Adresse.structure({
  name: String
});

Adresse
  .insert()
  .error()
  .success();

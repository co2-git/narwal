! function () {
  
  'use strict';

  require('colors');

  function transformRow (result) {

    var table = (this.table || this.tableName());

    var row = {};

    if ( result[table + '.id'] ) {
      row.id = +result[table + '.id'];
    }

    for ( var field in this.structure ) {

      if ( this.structure[field].type === Number ) {
        row[field] = +result[table + '.' + field];
      }

      else if ( this.structure[field].type === String ) {
        row[field] = result[table + '.' + field];
      }

      else if ( this.structure[field].type instanceof require('../Model') ) {
        row[field] = transformRow.apply(this.structure[field].type, [result]);
      }

      else if ( typeof this.structure[field].type === 'string' ) {
        if ( /^decimal\(/i.test(this.structure[field].type) ) {
          row[field] = result[table + '.' + field];
        }
      }
    }

    return row;
  }

  function exec (client) {
    var self = this;

    this.domain.run(function () {

      if ( ! client || typeof client.query !== 'function' ) {
        throw new Error('Missing client');
      }

      process.nextTick(function () {

        self['_' + self.verb]();

        // console.log(self.string, self.params);

        var q = self.statement;

        q = q.replace(/\?\?/g, '!');

        var len = q.length;

        for ( var i = 0, c = 0, v = 0; i < q.length; i ++ ) {
          if ( q[i] === '!' ) {

            v = '`' + self.params[c++] + '`';

            q = q.substr(0, i) + v + q.substr(i + 1, len);

            i += v.length;


          }

          else if ( q[i] === '?' ) {
            v = "'" + self.params[c++] + "'";

            q = q.substr(0, i) + v + q.substr(i + 1, len);

            i += v.length;


          }
        }

        self.params.forEach(function (param) {
          q = q.replace(/\?\?/, ('`' + param + '`').bold.italic.yellow);
        });

        self.params.forEach(function (param) {

          if ( typeof param === 'undefined' ) {
            param = null;
          }

          q = q.replace(/\?/, JSON.stringify(param).bold.yellow);
        });

        var then = self.domain.bind(function (error, results) {

          if ( error ) {
            console.log();
            console.log(q.bgRed);
            console.log();
            error.stack.split(/\n/).forEach(function (line) {
              console.log(line.yellow);
            });
            console.log();

            throw error;
            // process.exit();
          }

          if ( Array.isArray(results) ) {
            results = results.map(transformRow, self.model);

            if ( results.length === 1 && self.options.limit === 1 ) {
              results = results[0];
            }
          }

          console.log();
          console.log(q.bgGreen);
          console.log();
          console.log(JSON.stringify(results, null, 2));
          console.log();

          var emit = ['success', results];

          self.emit.apply(self, emit);
        });

        console.log(self.statement);

        console.log()
        console.log(self.params)
        console.log()

        client.query(self.statement, self.params, then);

      });
        
    });
  }

  module.exports = exec;

} ();

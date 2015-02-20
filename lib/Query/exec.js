! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function exec (client) {
    var self = this;

    this.domain.run(function () {

      if ( ! client || typeof client.query !== 'function' ) {
        throw new Error('Missing client');
      }

      process.nextTick(function () {

        self.emit('debug', { 'Query.exec()': {
          verb: self.verb
        } });

        // return;

        var q = self.string;

        self.params.forEach(function (param) {
          q = q.replace(/\?\??/, param.bold.yellow);
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

            self.emit('error', error);

            return;
          }

          console.log();
          console.log(q.bgGreen);
          console.log();
          console.log(results);
          console.log();

          switch ( self.verb ) {
            case 'insert':
              break;
          }

          // var row = self.options.row;

          // if ( 'insertId' in results ) {
          //   row.id = results.insertId;
          // }

          // if ( self.verb === 'find' ) {
          //   row = results;
          // }

          var emit = ['success', {}, results];

          self.emit.apply(self, emit);
        });

        client.query(self.string, self.params, then);

      });
        
    });
  }

  module.exports = exec;

} ();

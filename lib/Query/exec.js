! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function exec () {
    var self = this;

    this.domain.run(function () {

      process.nextTick(function () {

        var query = self.make();

        self.emit('debug', { 'Query.exec()': query, conn: self.options.conn });

        console.log(query.string.bgMagenta);
        console.log(query.params);

        self.options.conn.query(query.string, query.params,

          self.domain.intercept(function (results) {

            console.log('ohhhhhhhhhhh')

            var row = self.options.row;

            if ( 'insertId' in results ) {
              row.id = results.insertId;
            }

            if ( self.verb === 'find' ) {
              row = results;
            }

            var emit = ['success', row, results];

            self.emit.apply(self, emit);
          }));

      });
        
    });
  }

  module.exports = exec;

} ();

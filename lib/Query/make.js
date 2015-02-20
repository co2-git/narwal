! function () {
  
  'use strict';

  /**
   *  @method Query.make
   *  @return { string: String, params: [String] }
   */

  function make () {
    var string = '';
    var params = [];

    switch ( this.verb ) {
      case 'find':
        string += 'SELECT * FROM ??.??';
        params.push(this.options.database, this.options.table);
        break;

      case 'insert':
        string += 'INSERT INTO ??.?? (%s) VALUES(%s)';
        params.push(this.options.database, this.options.table);

        for ( var field in this.model.structure ) {
          string = require('util').format(string, '??,%s');
          params.push(field);
        }

        string = string.replace(/,%s/, '');

        for ( var field in this.options.row ) {
          string = require('util').format(string, '?,%s');
          params.push(this.options.row[field]);
        }

        string = string.replace(/,%s/, '');

        break;

      case 'create table':
        string += 'CREATE TABLE ?? ( id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, ';
        params.push(this.model.table);

        var type;

        var dataType = '';

        for ( var field in this.model.structure ) {

          type = this.model.structure[field].type;

          if ( type instanceof require('../Model') ) {
            type = Number;
          }

          if ( typeof type === 'function' ) {
            switch ( type ) {
              case String:
                dataType = 'VARCHAR(255) NOT NULL';
                break;

              case Number:
                dataType = 'INT(11) NOT NULL';
                break;
            }
          }

          else if ( typeof type === 'string' ) {
            dataType = type + ' NOT NULL';
          }

          string += '?? ' + dataType + ',';
          params.push(field);
        }

        string += ' CREATED timestamp NOT NULL DEFAULT current_timestamp, UPDATED timestamp NOT NULL' ;

        for ( var field in this.model.structure ) {

          type = this.model.structure[field].type || this.model.structure[field];

          if ( this.model.structure[field].index ) {

            if ( this.model.structure[field].index.unique ) {
              string += ', UNIQUE KEY (??)';
              params.push(field);
            }

          }

          if ( type instanceof require('../Model') ) {

            string += ', FOREIGN KEY (??) REFERENCES ?? (id)';
            params.push(field, type.table);

          }

        }

        string += ') ENGINE=INNODB DEFAULT CHARACTER SET utf8;';

        break;
    }

    return {
      string: string,
      params: params
    };
  }

  module.exports = make;

} ();

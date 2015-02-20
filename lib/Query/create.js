! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function create () {

    this.verb = 'create';

    this.string += 'CREATE TABLE ?? ( id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, ';

    this.params.push(this.model.table);

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

      this.string += '?? ' + dataType + ',';
      this.params.push(field);
    }

    this.string += ' CREATED timestamp NOT NULL DEFAULT current_timestamp, UPDATED timestamp NOT NULL' ;

    for ( var field in this.model.structure ) {

      type = this.model.structure[field].type || this.model.structure[field];

      if ( this.model.structure[field].index ) {

        if ( this.model.structure[field].index.unique ) {
          this.string += ', UNIQUE KEY (??)';
          this.params.push(field);
        }

      }

      if ( type instanceof require('../Model') ) {

        this.string += ', FOREIGN KEY (??) REFERENCES ?? (id)';
        this.params.push(field, type.table);

      }

    }

    this.string += ') ENGINE=INNODB DEFAULT CHARACTER SET utf8;';

    return this;
  }

  module.exports = create;

} ();

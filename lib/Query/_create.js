! function () {
  
  'use strict';

  function getType (type, isNull) {
    var dataType = 'VARCHAR(255)';

    if ( type instanceof require('../Model') ) {
      type = Number;
    }

    if ( typeof type === 'function' ) {
      switch ( type ) {
        case String:
          dataType = 'VARCHAR(255)';
          break;

        case Number:
          dataType = 'INT(11)';
          break;

        case Date:
          dataType = 'TIMESTAMP';
          break;
      }
    }

    else if ( typeof type === 'string' ) {
      dataType = type;
    }

    if ( isNull ) {
      dataType += ' NULL';
    }

    else {
      dataType += ' NOT NULL';
    }

    return dataType;
  }

  function _create () {

    var create = this;

    function getDefault (field) {
      if ( 'default' in field ) {
        create.params.push(field.default);
        return ' DEFAULT ? ';
      }
      return '';
    }

    function getComment (comment) {
      if ( comment ) {
        create.params.push(comment);
        return ' COMMENT ? ';
      }
      return '';
    }

    /** Initiate CREATE TABLE statement */

    this.statement = 'CREATE TABLE ?? ( ';

    /** Get table name */

    this.params.push(this.model.table || this.model.tableName(this.options));

    /** ID field */

    if ( this.model.implicit.id !== false ) {
      this.statement += '?? INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, ';
      this.params.push('id');
    }

    /**
     *   Fields
     */

    var fields = [];

    for ( var field in this.model.structure ) {
      /**
       *    Find data type
      */
      
      var fieldStatement = ' ?? ';

      this.params.push(field);

      fieldStatement += getType(this.model.structure[field].type, this.model.structure[field]['null']);

      fieldStatement += getDefault(this.model.structure[field]);

      fieldStatement += getComment(this.model.structure[field].comment);

      fields.push(fieldStatement);

    }

    this.statement += fields.join(', ');

    /**
     *    Implicit fields
     */

    var implicitFields = [];

    if ( this.model.implicit.created ) {
      implicitFields.push("?? TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00'");
      this.params.push('_created');
    }

    if ( this.model.implicit.updated ) {
      implicitFields.push("?? TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW()");
      this.params.push('_updated');
    }

    if ( this.model.implicit.revision ) {
      implicitFields.push('?? INT(11) NOT NULL');
      this.params.push('_revision');
    }

    this.statement += ', ' + implicitFields.join(', ') ;

    /**
     *    Indexes
     */

    for ( var field in this.model.structure ) {

      /**
       *    Index
       */

      if ( this.model.structure[field].index ) {
        this.statement += ', INDEX (??)';
        this.params.push(field);
      }

      /**
       *    Unique
       */

      if ( this.model.structure[field].unique ) {
        this.statement += ', UNIQUE KEY (??)';
        this.params.push(field);
      }

      /**
       *    Foreign keys
       */

      if ( this.model.structure[field].type instanceof require('../Model') ) {

        this.statement += ', FOREIGN KEY (??) REFERENCES ?? (id)';
        this.params.push(field, this.model.structure[field].type.table || this.model.structure[field].type.tableName());

      }

    }

    /**
     *    Multi columns keys
     */

    for ( var key in this.model.indexes ) {

    }

    this.statement += ') ENGINE=INNODB DEFAULT CHARACTER SET utf8;';

    return this;
  }

  module.exports = _create;

} ();

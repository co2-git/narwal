! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function Is (value, operator) {
    this.value = value;
    this.operator = operator;
  }

  Is.above = function (value) {
    return new Is(value, '>');
  };

  Is.below = function (value) {
    return new Is(value, '<');
  };

  Is.not = function (value) {
    return new Is(value, '!=');
  };

  Is.field = function (value) {
    var is = new Is(value, '=');

    is.valueIsAField = true;

    return is;
  };

  Is.not.field = function (value) {
    var is = new Is(value, '!=');

    is.valueIsAField = true;

    return is;
  };

  module.exports = Is;

} ();

n   a   r   w   a   l
=====================

`narwal` is a Object Model library for MySQL.

# Install

```bash
npm install narwal
```

# Usage

First, create models of your database structure. Let's take the infamous `employees` table:


```js

var narwal = require('narwal');

var Employee = new narwal.Model('Employee', {
  
  'first_name': {
    type: String,
    required: true
  },

  'last_name': {
    type: String,
    required: true
  },

  'dob': {
    type: Date,
    required: true
  }

});
```

Now it's easy to query your Employee model:

```js
// SELECT * FROM employees

Employee.forEach(function (employee) {
  // ...
});

// UPDATE employees SET last_name='Johnson' WHERE last_name='Jackson';

Employee.update({ last_name: 'Jackson' }, { last_name: 'Johnson' });

// INSERT INTO employees VALUES('Chihiro', 'Ono')

Employee.insert({ first_name: 'Chihiro', last_name: 'Ono' });

// DELETE FROM employees WHERE last_name='Johnson';

Employee.remove({ last_name: 'Johnson' })

```

# The Model

## Best practices

It is best to saved any model in its own file such as:

```js
// file: models/Player.js

! function () {
  
  'use strict';

  var narwal = require('narwal');

  module.exports = new narwal.Model('Player', {
    name: String,
    score: Number,
    dob: Date
  });

} ();
```

Then it is easy to interact with this model from another file using `require`:

```js
// some other file

var Player = require('./models/Player');

Player.forEach(console.log.bind(console));
```

## The constructor

```js
new narwal.Model(String name, Object schema, Object options);
```

### @arg name

The name of the Model. By default, `narwal` will map this name with a table name in the following fashion: the name is put to lower case and a 's' is added to it. Hence, `new narwal.Model('Player')` will be mapped to the table `players`.

You can overwrite that if you want to map your model to a different table. See the options section below.

### @arg schema

View schema section below

### @arg options

An object that can have the following properties:

| Property  | Description             | Type      |
|-----------|-------------------------|-----------|
| table     | The name of the table   | String    |


## The schema

Consider the following in MySQL:

```sql
-- MySQL DDL

CREATE TABLE `players` (
  id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  score INT(11) NOT NULL,
  dob TIMESTAMP NOT NULL
);
```

This is how to map it:

```js

// Long field-definition syntax:
new narwal.Model('Player', {
  name: {
    type: String
  },
  score: {
    type: Number
  },
  dob: {
    type: Date
  }
});


// Short field-definition syntax:

new narwal.Model('Player', {
  name: String,
  score: Number,
  dob: Date
});
```

### Data types

| Type      | MySQL           |
|-----------|-----------------|
| String    | VARCHAR(255)    |
| Number    | INT(11)         |
| Date      | TIMESTAMP       |

If you need to use other data types, just enter them as a string:

```js
{
  "lat": {
    type: "decimal(9,6)"
  }
}

// or, short-syntax
{
  "lat": "decimal(9,6)"
}
```
n    a    r    w    a    l
==========================

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

### Required

You can mark a field as required:

```js
new narwal.Model('Player', {
  "name": {
    type: String,
    required: true
  }
);
```

# The Queries

All queries return an instance of Narwal.Query

## The Narwal Query

The query is an emitter. It emits an error event on failure and a success event otherwise.

```js
Player
  
  .find()
  
  .on('error', function (error) {
    throw error;
  })
  
  .on('success', function (players) {
    console.log(players.length);
  })
```

Or you can use the convenient methods `error` and `success`:

```js
Player

  .find()
  
  .error(function (error) {
    throw error;
  })
  
  .success(function (players) {
    console.log(players.length);
  });
```

Or the `then` method:

```js
Player

  .find()
  
  .then(
    function (players) {
      console.log(players.length):
    },
    
    function (error) {
      throw error;
    }
  );
```

Or you can use the callback syntax:

```js
Player

  .find(function (error, players) {
    if ( error ) {
      throw error:
    }
    
    console.log(players.length);
  });
```

## SELECT

You can perform a select method using the `find()` method. On success, it will emit an array of rows.

```sql
SELECT * FROM players;
```

```js
Player
  
  .find()
  
  .success(function (players) {
    // ...
  });
```

### forEach

Since `find()` returns an array, you can use the convenient method `forEach` to walk them:

```js
Player
  
  .find()
  
  .forEach(function (player) {
    console.log(player.name);
  });
```

You can omit the `find()` method:

```js
Player
  
  .forEach(function (player) {
    console.log(player.name);
  });
```

### SELECT ... WHERE

Pass a JSON object to be used as a filter:

```sql
SELECT * FROM players WHERE name='Dora';
```

```js
Player.find({ name: 'Dora' });
```

#### Map

| SQL                         | Narwal                      |
|-----------------------------|-----------------------------|
| field=value                 | { field: *value* }            |
| field!=value                | { field: { **not**: *value* } }   |
| field=value AND field=value | { field: [*value*, *value*] }   |
| (field=value AND field=value) OR (field=value AND field=value) | [ { field: *value*, field: *value* }, { field: *value*, field: *value* } ] | 
| field>value                 | { field: { **gt**: *value* } }    |
| field>=value                | { field: { **ge**: *value* } }    |
| field<value                 | { field: { **lt**: *value* } }    |
| field<=value                | { field: { **le**: *value* } }    |
| field regexp value          | { field: **/***value***/** }          |
| field like value            | { field: { **like**: *value* } }  |


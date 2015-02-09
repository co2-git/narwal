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

### Specify a field name

You can choose to use a different field name:

```js
new narwal.Model('Player', {
  "name": {
    type: String,
    field: 'player_name'
  }
);
```

### Join and reference

You can join two or more tables together:

```js
var Category = new narwal.Model('Category', { name: String, code: Number });

var Product = new narwal.Model('Product', { name: String, category: Category });
```

By default, `narwal` joins a reference table to its `id` field. You can specify another field however:

```js
new narwal.Model('Product', {
  // JOIN products.category to 
  category: {
    ref: Category,
    on: 'code' // default: 'id'
  }
});
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

### SELECT ONE

You can choose to select only one row. In this case, success will emit an Object instead of an Array of objects.

```js
Player

  .findOne()
  
  .then(function(player) {
    // ...
  });
```

### SELECT BY ID

You can select directly by id

```sql
SELECT * FROM players WHERE id=2000;
```

```js
Player

  .findById(2000)
  
  .then(function(player) {
    // ...
  });
```

### SELECT FIELDS

You can retrieve only a specific set of fields

```sql
SELECT id,score FROM players;
```

```js
Player

  .find()
  
  .select('id', 'score')
  
  .forEach(function (player) {} );
```

### UNSELECT FIELDS

You can substract fields from the selection

```sql
SELECT name,  player, score FROM players;
```

```js
Player

  .find()
  
  .select('-id')
  
  .forEach(function (player) {} );
```

### SELECT COLUMNS AS



## JOIN

```sql
SELECT * FROM players JOIN teams ON players.team=teams.id;
```

```js
Player

  .find()
  
  .join('team');
```

### JOIN AND SELECT

```sql
SELECT players.name, teams.name FROM players JOIN teams ON players.team=teams.id;
```

```js
Player

  .find()
  
  .join('team')
  
  .select('name', { 'team': 'name' });
```

### LEFT JOIN

```sql
SELECT * FROM players LEFT JOIN teams ON players.team=teams.id;
```

```js
Player

  .find()
  
  .join.left('team');
```

### RIGHT JOIN

```sql
SELECT * FROM players RIGHT JOIN teams ON players.team=teams.id;
```

```js
Player

  .find()
  
  .join.right('team');
```

### INNER JOIN

```sql
SELECT * FROM players INNER JOIN teams ON players.team=teams.id;
```

```js
Player

  .find()
  
  .join.inner('team');
```

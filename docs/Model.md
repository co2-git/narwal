# The Model

## Best practices

It is best to saved any model in its own file such as:

### models/Player.js

```js
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

### index.js

```js

var Player = require('./models/Player');

Player
  
  .connect('mysql://narwal@localhost/narwal')
  
  .forEach(function forEachPlayer (player) {
    assert(player instanceof Player.Row);
  });

```

## The constructor

```js
new narwal.Model(String name, Object schema, Object options);
```

### name

The name of the Model. By default, `narwal` will map this name with a table name in the following fashion: the name is put to lower case and a 's' is added to it. Hence, `new narwal.Model('Player')` will be mapped to the table `players`.

You can overwrite that if you want to map your model to a different table. See the options section below.

### schema

View schema section below

### options

An optional object that can have the following properties:

| Property  | Description             | Type      | Default                         |
|-----------|-------------------------|-----------|---------------------------------|
| table     | The name of the table   | String    | model.name.toLowerCase() + "s"  |
| id        | The field name of id    | String    | "id"                            |
| host      | MySQL server host       | String    | "localhost"                     |
| port      | MySQL server port       | Number    | 3306                            |
| user      | MySQL user name         | String    | "root"                          |
| password  | MySQL user password     | String    | null


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

n    a    r    w    a    l
==========================

`narwal` (NodeJS) is a loosely coupled structure-data architecture for modeling and moving around your MySQL data.

# Install

```bash
npm install narwal
```

# Usage

First, create models of your database structure. Let's take the infamous `employees` table:


```js

// file: models/Employee.js

var narwal = require('narwal');

// Declare the structure

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

// Helper functions are easy to implement:

Employee.getFullName = function getFullName (employee_id, cb) {

  this
    
    .findById(employee_id)
    
    .on('success', function (employee) {
    
      if ( ! employee ) {
        return cb(new Error('No such employee'));
      }
      
      cb(null, [employee.first_name, employee.last_name].join(' '));
    })
    
    .on('error', cb);
};

```

Now it's easy to query your Employee model from another file:

```js

// file: index.js

var Employee = require('./models/Employee');

// Create a connection link

Employee.connect('mysql://user@host/db');

// Get Full Name

Employee.getFullName(function gotFullName (error, fullName) {
  //...
});

// SELECT * FROM employees ORDER BY dob DESC

Employee
  .forEach(function forEachEmployee (employee) {
    // ...
  });

// UPDATE employees SET last_name='Johnson' WHERE first_name='Jack';

Employee
  .filter({ first_name: 'Jack' })
  .map({ last_name: 'Johnson' });

// INSERT INTO employees VALUES('Chihiro', 'Ono')

Employee
  .push({ first_name: 'Chihiro', last_name: 'Ono' })
  .then(function pushEmployeeThen (employee) {
    // ...
  });

// DELETE FROM employees WHERE last_name='Johnson' LIMIT 5;

Employee
  .filter({ last_name: 'Johnson' })
  .sort('id')
  .pop(5);

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

### @arg name

The name of the Model. By default, `narwal` will map this name with a table name in the following fashion: the name is put to lower case and a 's' is added to it. Hence, `new narwal.Model('Player')` will be mapped to the table `players`.

You can overwrite that if you want to map your model to a different table. See the options section below.

### @arg schema

View schema section below

### @arg options

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

# Connect

## Default credentials

If you refer to the Model section above, you will see that `narwal` connects by default to `mysql://root@localhost/test`.

## Auto-connect

When executing a query, `narwal` will try to connect. If you would use default credentials (which you should not for security reasons), you wouldn't need to call a `connect` method:

```js
// work as is
var model = new narwal.Model('User', {});
// mysql://narwal@localhost/narwal/users
model.find().forEach(function (user) {});
```

## Credentials format

Credentials can be passed either a string following the URL format as so:

    mysql://user:password@host:port/dbname
    
Or as an object such as:

```js
var credentials = {
  "host": String,
  "port": Number,
  "user": String,
  "password": String,
  "dbname": String
};
```

## Ways to connect

To specify another credentials, you have two choices:

### Use cache

You can benefit from npm internal cache mechanism and connect directly from the module:

```js
var narwal = require('narwal');

narwal.connect('mysql://some-other-host');

// Now in runtime, you don't need to specify again a connexion link

var Player = require('../models/Player');

// Your query will be executed with the declared credentials

Player.find();
```

### Model level

You can also connect at model level:

```js
var Player = require('../models/Player');

Player
  .connect(credentials)
  .find();
```

You can switch connections:

```js
var Player = require('../models/Player');

var rows;

Player
  
  // Connect to DB 1
  
  .connect(credentials1)
  
  // SELECT
  
  .find()
  
  // On results
  
  .found(function foundPlayers (players) {
    Player
      
      // Connect to DB2
      
      .connect(credentials2)
      
      // Insert results
      
      .insert(players);
  });
```

If you declare connexions both on module level and on model level, model level will have precedence.

# The Queries

All queries return an instance of Narwal.Query

## The Narwal Query

The query is an emitter. It emits an error event on failure and a success event otherwise.

```js
Player
  
  .find()
  
  .on('error', function findPlayerError (error) {
    throw error;
  })
  
  .on('success', function findPlayerSuccess (players) {
    console.log(players.length);
  })
```

Or you can use the convenient methods `error` and `success`:

```js
Player

  .find()
  
  .error(function findPlayerError (error) {
    throw error;
  })
  
  .success(function findPlayerSuccess (players) {
    console.log(players.length);
  });
```

Or the `then` method:

```js
Player

  .find()
  
  .then(
    function findPlayerThen (players) {
      console.log(players.length):
    },
    
    function findPlayerThenError (error) {
      throw error;
    }
  );
```

Or you can use the callback syntax:

```js
Player

  .find(function findPlayerCallback (error, players) {
    if ( error ) {
      throw error:
    }
    
    console.log(players.length);
  });
```

## SELECT

### The Array approach

When retrieving an array of rows, you can favor a syntax that looks more closely like arrays in JavaScript:

```sql
SELECT * FROM players
```

```js
Player.forEach(function forEachPlayer (player) {
  // ...
});
```

```sql
SELECT * FROM players WHERE first_name='Jack'
```

```js
Player
  .filter({ first_name: 'Jack' })
  .forEach(forEachPlayer);
```


```sql
SELECT * FROM players WHERE first_name!='Jack' LIMIT 10
```

```js
Player
  .not({ first_name: 'Jack' })
  .limit(10)
  .forEach(forEachPlayer);
```

```sql
SELECT * FROM players WHERE first_name!='Jack' LIMIT 10 ORDER BY dob DESC, id ASC
```

```js
Player
  .not({ "first_name": 'Jack' })
  .limit()
  .sort({ "dob": false, "id": true })
  .forEach(forEachPlayer);
```

## The Stream approach

You can stream data:

```js

// This will save the entire table to /tmp/players.json

Player
  .stream()
  .pipe(require('fs').createWriteStream('/tmp/players.json'));
```

You can use built-in transformers and other transformers:

```js

// This will save the entire table to /tmp/players.sql

Player
  .stream('sql')
  .pipe(zlib.createGunzip())
  .pipe(fs.createWriteStream('/tmp/players.tar.gz'));
```

Now let's reinject our JSON file into the Model:

```js
fs.createReadStream('/tmp/players.json')
  .pipe(Player.stream())
  .on('end', function () {
    console.log('Import complete!');
  });
```

## Find

You can perform a select method using the `find()` method. On success, it will emit an array of rows.

```sql
SELECT * FROM players;
```

```js
Player
  
  .find()
  
  .success(function findPlayerSuccess (players) {
    // ...
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
| field!=value                | { field: { **$not**: *value* } }   |
| field=value AND field=value | { field: [*value*, *value*] }   |
| (field=value AND field=value) OR (field=value AND field=value) | [ { field: *value*, field: *value* }, { field: *value*, field: *value* } ] | 
| field>value                 | { field: { **$gt**: *value* } }    |
| field>=value                | { field: { **$ge**: *value* } }    |
| field<value                 | { field: { **$lt**: *value* } }    |
| field<=value                | { field: { **$le**: *value* } }    |
| field regexp value          | { field: **/***value***/** }          |
| field like value            | { field: { **$like**: *value* } }  |

### SELECT ONE

You can choose to select only one row. In this case, success will emit an Object instead of an Array of objects.

```js
Player

  .findOne()
  
  .then(function findOnePlayerThen (player) {
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
  
  .then(function findPlayerByIdThen (player) {
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
  
  .forEach(function forEachPlayer (player) {} );
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
  
  .forEach(function forEachPlayer (player) {} );
```

### SELECT COLUMNS AS



# JOIN

```sql
SELECT * FROM players JOIN teams ON players.team=teams.id;
```

```js
Player

  .find()
  
  .join('team');
```

## JOIN AND SELECT

```sql
SELECT players.name, teams.name FROM players JOIN teams ON players.team=teams.id;
```

```js
Player

  .find()
  
  .join('team')
  
  .select('name', { 'team': 'name' });
```

## LEFT JOIN

```sql
SELECT * FROM players LEFT JOIN teams ON players.team=teams.id;
```

```js
Player

  .find()
  
  .join.left('team');
```

## RIGHT JOIN

```sql
SELECT * FROM players RIGHT JOIN teams ON players.team=teams.id;
```

```js
Player

  .find()
  
  .join.right('team');
```

## INNER JOIN

```sql
SELECT * FROM players INNER JOIN teams ON players.team=teams.id;
```

```js
Player

  .find()
  
  .join.inner('team');
```

## Find in Joined table

```sql
SELECT * FROM players JOIN teams ON players.team=teams.id WHERE team.name='Red';
```

```js
Player.find({ "team": { "name": "Red" } };
```

# Insert

Use the `insert()` method to replay `INSERT INTO` sql statements`.

```sql
INSERT INTO players (name) VALUES('Rebecca');
```

```js
Player

  .insert({ name: 'Rebecca' })
  
  .then(function insertPlayerThen (Rebecca) {
    // ...
  });
```

# Update

```sql
UPDATE players SET score=100 WHERE players.team=(SELECT teams.id FROM teams WHERE teams.name='Red');
```

```js
Player

  .update({ "score": 100 })
  
  .where({ "team": { "name": "Red" } });
```

# Increment

```sql
UPDATE players SET score= score + 100 WHERE players.team=(SELECT teams.id FROM teams WHERE teams.name='Red');
```

```js
Player

  .inc({ "score": 100 })
  
  .where({ "team": { "name": "Red" } });
```

# Decrement

```sql
UPDATE players SET score= score - 100 WHERE players.team=(SELECT teams.id FROM teams WHERE teams.name='Red');
```

```js
Player

  .dec({ "score": 100 })
  
  .where({ "team": { "name": "Red" } });
```

# Update user function

```sql
UPDATE players SET name=LOWER(name) WHERE players.team=(SELECT teams.id FROM teams WHERE teams.name='Red');
```

```js
Player

  .update({ "name": function nameToLowerCase (name) { return name.toLowerCase(); } })
  
  .where({ "team": { "name": "Red" } });
```

# Remove

# Create

# Dump

You can simulate a dump statement

```js
Player.dump();
```

This will return a stream containing the dump

```js
Player.dump().pipe(process.stdout);
```

By default, dump contains data and structure. Example of a dump:

```sql
-- dump generated by narwal date

-- structure

CREATE TABLE IF NOT EXISTS players (...);

-- data

INSERT INTO players VALUES (...);
```

# Backup

You can backup a table using narwal. It will gzip a folder with two files in it:

- `data.sql` The MySQL dump of the data of the table
- `structure.js` A Narwal model file

```js
Player.export();
```

This does not save the gzip anywhere but returns a stream of the gzip that can be handled by chain:

```js
Player.export().pipe(unzipTransformStream).pipe(writableStream);
```

Gzips are n by default as *narwal-`Model`-`YY`-`MM`-`DD`-`HH`-`II`-`SS`.tar.gz*

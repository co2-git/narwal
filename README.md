n    a    r    w    a    l
==========================

## alpha - do not use (yet)

`narwal` (NodeJS) is a loosely coupled structure-data architecture for modeling and moving around your MySQL data.

# Install

```bash
npm install narwal
```

# Use

```js
var narwal = require('narwal');
```

# Overview

`narwal` gives you model abstraction so you manipulate your MySQL data and structure easier.

```js
var Player = new narwal.Model('Player', { name: String, score: Number });
```

To connect to MySQL:

```js
Player
  .connect('mysql://user:password@host/db');
```

```sql
SELECT name FROM players WHERE name='Lara' LIMIT 10 ORDER BY score DESC
```

```js
Player
  .find()
  .filter({ name: 'Lara' })
  .limit(10)
  .sort({ score: false })
  .forEach(function (player) {
    // ...
  });
```

```sql
INSERT INTO players (name) VALUES('Lara')
```

```js
Player
  .insert({ name: 'Lara' });
```

```sql
UPDATE players SET score=100 WHERE name='Lara'
```

```js
Player
  .filter({ name: 'Lara' })
  .update({ score: 100 })
```

```sql
DELETE FROM players WHERE score = 100
```

```js
Player
  .filter({ score: 100 })
  .remove();
```

`narwal` comes with stream and transform support:

```js

// SELECT all rows from players, save them to a file and insert them into another table

new narwal.Model('Player', { name: String, score: Number })
  .stream()
  .format('sql')
  .pipe(fs.createWriteFile('players.sql'))
  .pipe(new narwal.Model('Player', { name: String, score: Number }).connect('mysql://...'))
```

# [The Model](docs/Model.md)

# [Connect](docs/Connect.md)

# [The Query](docs/Query.md)

# Model constructor

Creates a new Narwal Model.

    new narwal.Model(String name, Object? structure, Object? options);

| Argument | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| name | String | ✔ | | The name of the model |
| structure | Object | ✖ | `{}` | The structure |
| options | Object | ✖ | `{}` | Model options |

```js
new narwal.Model('Player', { name: String }, { prefix: 'test_' });
```
    
## Model find

Performs a find query. Returns Query. Success emits an Array.

    Model.find(Mixed? filter)

```js

// Find all

Model.find();

// Sugar for Model.find().filter(Object);

Model.find({ field: 'value' });

// Sugar for Model.find().limit(Number);

Model.find(10);
```

Events:

- **error** `Error`
- **success** `[Row]`

Chainable:

| Name | Example | Description |
|------|---------|-------------|
| on | `find().on(String event, Function then)` | Event listener |
| then | `find().then(Function success, Function? error)` |  Promise shim | 
| success | `find().success(Function success)` |  Listens on "success" | 
| error | `find().error(Function error)`  | Listens on "error" | 
| found | `find().found(Function success)` |  Listens on "success" and [Row].length | 
| notFound | `find().notFound(Function success)` |  Listens on "success" and ! [Row].length | 
| forEach | `find().forEach(function (model) { //... }})` | Listens on "success" and for each [Row] |

## Model findOne

Performs a find query and returns first found. Returns Query. Success emits a Row object.

    Model.findOne(Mixed? filter)

```js

// Find one with no filter

Model.findOne();

// Sugar for Model.findOne().filter(Object);

Model.findOne({ field: 'value' });
```

Events:

- **error** `Error`
- **success** `Row`

Chainable:

| Name | Example | Description |
|------|---------|-------------|
| on | `find().on(String event, Function then)` | Event listener |
| then | `find().then(Function success, Function? error)` |  Promise shim | 
| success | `find().success(Function success)` |  Listens on "success" | 
| error | `find().error(Function error)`  | Listens on "error" | 
| found | `find().found(Function success)` |  Listens on "success" and Row | 
| notFound | `find().notFound(Function success)` |  Listens on "success" and ! Row |


# Find

# Insert

# Update

# Remove

# Export / import


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

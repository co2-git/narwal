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

# Model

## Model `constructor`

Creates a new Narwal Model.

    {Model} new narwal.Model(String name, Object? structure, Object? options);

| Argument | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| name | String | ✔ | | The name of the model |
| structure | Object | ✖ | `{}` | The structure |
| options | Object | ✖ | `{}` | Model options |

```js
new narwal.Model('Player', { name: String }, { prefix: 'test_' });
```

## Model `connect()`

MySQL thread setter. Narwal models are connexion-agnostic. We use [node-mysql](https://github.com/felixge/node-mysql/) default connection method for the moment. Future implementations to come.

    {Model} Model.connect(String | Object);

```js

var Player = require('./models/Player');

Player.forEach(fn);

Player.connect('mysql://user@localost/db');
  
// You can also a Narwal client

var Client = require('narwal').Client;

var client = new Client('mysql://user@localost/db');

Player.connect(client).stream().limit(100000).rows(1000);
```

Events:

- **error** `Error`
- **connected**
- **disconnected**

Helpers:

| Name | Example | Description |
|------|---------|-------------|
| connected | `client().connected(Function connected)` |  Listens on "connected" | 
| disconnected | `client().disconnected(Function disconnected)` |  Listens on "disconnected" | 

## Model `create()`

Create a table stucture from Model. Returns `Query`.

    {Query} Model.create(Object? options, Function? callback)

```sql
CREATE TABLE players (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR NOT NULL )
  ENGINE=MyISAM DEFAULT CHARSET utf-8
```

```js
new narwal

  .Model('Player', { name: String })
  
  .create();
```

### Model `create({ id: false })`

Do not create auto id field

```sql
CREATE TABLE players (
  name VARCHAR NOT NULL )
  ENGINE=MyISAM DEFAULT CHARSET utf-8
```

```js
new narwal
  
  .Model('Player', { name: String })
  
  .create({ id: false });
```

### Model `create({ id: String })`

Use another name for id

```sql
CREATE TABLE players (
  player_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR NOT NULL )
  ENGINE=MyISAM DEFAULT CHARSET utf-8
```

```js
new narwal
  
  .Model('Player', { name: String })
  
  .create({ id: 'player_id' });
```

### Model `create({ table: String })`

Use another name for table

```sql
CREATE TABLE players_es (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR NOT NULL )
  ENGINE=MyISAM DEFAULT CHARSET utf-8
```

```js
new narwal
  
  .Model('Player', { name: String })
  
  .create({ table: 'players_es' });
```

### Model `create({ index: String || [String] })`

Create an index

```sql
CREATE TABLE models (
  model_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR NOT NULL,
  INDEX(name))
  ENGINE=MyISAM DEFAULT CHARSET utf-8
```

```js

// You could to that at structure level:

new narwal
  
  .Model('Player', { name: { type: String, index: true } })
  
  .create();
  
// Or at create level

new narwal
  
  .Model('Player', { name: String })
  
  .create({ index: 'name' });
  
// You can index more than one field using an array

new narwal
  
  .Model('Player', { name: String, quote: String })
  
  .create({ index: ['name', 'quote'] });
```

Events:

- **error** `Error`
- **success**

Helpers:

| Name | Example | Description |
|------|---------|-------------|
| created | `create().created(Function success)` |  Listens on "success" |

## Model `filter()`

Performs a filter query. Returns [`Query`](#Query).

    {Query} Model.filter(Object filter)
    
```sql
SELECT FROM models WHERE field='value'
```

```js
Model.filter({ field: 'value' });
```

Events:

- **error** `Error`
- **success** `[Row]`

Helpers:

| Name | Example | Description |
|------|---------|-------------|
| found | `find().found(Function success)` |  Listens on "success" and [Row].length | 
| notFound | `find().notFound(Function success)` |  Listens on "success" and ! [Row].length | 
| forEach | `find().forEach(function (model) { //... }})` | Listens on "success" and for each [Row] |
    
## Model `find()`

Performs a find query. Returns [`Find`](#Find).

    {Query} Model.find(Mixed? filter)

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

Helpers:

| Name | Example | Description |
|------|---------|-------------|
| found | `find().found(Function success)` |  Listens on "success" and [Row].length | 
| notFound | `find().notFound(Function success)` |  Listens on "success" and ! [Row].length | 
| forEach | `find().forEach(function (model) { //... }})` | Listens on "success" and for each [Row] |

## Model `findById()`

Performs a find query with a filter by id. Returns `Query`.

    Model.findById(Number)

```js

// Find by id

Model.findById(3837283);
```

Events:

- **error** `Error`
- **success** `[Row]`

Helpers:

| Name | Example | Description |
|------|---------|-------------|
| found | `findById().found(Function success)` |  Listens on "success" and [Row].length | 
| notFound | `findById().notFound(Function success)` |  Listens on "success" and ! [Row].length |

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

Helpers:

| Name | Example | Description |
|------|---------|-------------|
| found | `findOne().found(Function success)` |  Listens on "success" and Row | 
| notFound | `findOne().notFound(Function success)` |  Listens on "success" and ! Row |

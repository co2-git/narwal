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
// Create a model representation of a table called players
// This table must exists with a matching structure as the one modelized

var Player = new narwal.Model('Player', { name: String, score: Number, joined: Date });
```

```sql
SELECT name FROM players WHERE score > 100 LIMIT 10 ORDER BY joined DESC
```

```js
Player // SELECT
  
  // LIMIT 10
  .find(10)
  
  // WHERE score > 100
  .above({ 'score': 100 })
  
  // ORDER BY joined DESC
  .sort({ 'joined': false })
  
  // select only name column
  .select('name')
  
  .forEach(function (player) {
    // ...
  });
```

```sql
INSERT INTO players (name) VALUES('Lara')
```

```js
Player

  .push({ name: 'Lara' })
  
  .pushed(function (player) {});
```

```sql
UPDATE players SET score=100 WHERE name='Lara'
```

```js
Player
  
  .filter({ name: 'Lara' })
  
  .update({ score: 100 });
  
// Update can be used only

Player.update({ name: 'Lara' }, { score: 100 });
  
// Then can be invoked as well

Player
  
  .where({ name: 'Lara' })
  
  .then({ score: 100 });
```

```sql
DELETE FROM players WHERE score = 100
```

```js
Player

  // WHERE score = 100
  .filter({ score: 100 })
  
  // DELETE
  .remove();
  
// Short cut

Player.remove({ score: 100 });

// With then, invoke false to mean removal

Player
  
  .where({ score: 100 })
  
  .then(false)
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
  name VARCHAR NOT NULL,
  score INT NOT NULL DEFAULT 500)
  ENGINE=INNODB DEFAULT CHARSET utf-8
```

```js
new narwal

  .Model('Player', {
    'name': String,
    'score': {
      'type': Number,
      'default': 500
    }
  })
  
  .create();
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

## Model `findOne()`

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

## Model `limit()`

Apply a limit filter. Returns Query. Success emits `[Row]`.

    {Query} Model.limit(Number limit).success([Row])

```js

// Find 10

Model.limit(10);

// Find one (will return an array, even if it has only one row in it)

Model.limit(1);
```

Events:

- **error** `Error`
- **success** `[Row]`

Helpers:

| Name | Example | Description |
|------|---------|-------------|
| found | `limit().found(Function success)` |  Listens on "success" and `[Row].length` | 
| notFound | `limit().notFound(Function success)` |  Listens on "success" and `! [Row].length` |
| forEach | `find().forEach(function (model) { //... }})` | Listens on "success" and for each [Row] |

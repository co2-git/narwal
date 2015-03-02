n    a    r    w    a    l
==========================

## alpha - do not use (yet)

`narwal` is a **loosely coupled structure-data architecture** for modeling and moving around MySQL data.

# Install

```bash
npm install narwal
```

```js
var narwal = require('narwal');
```

# Model

With `narwal` it's easy to modelize your tables structure:

```js
// Model for `employees` table

new narwal.Model("Employee", {

  // FIELD first_name VARCHAR(255)
  
  "first_name": {
    type:       String,
    required:   true
  },
  
  // FIELD last_name VARCHAR(255)
  
  "last_name": {
    type:       String,
    required:   true
  },
  
  // FIELD email VARCHAR(255)
  
  "email": {
    type:       String
    validate:   /^.+@.+$/
  },
  
  // FIELD dob TIMESTAMP
  
  "dob": {
    type:       Date
  },
  
  // FIELD active TINYINT(1) DEFAULT 0
  
  "active": {
    type:       Boolean,
    default:    false
  }
});
```

Find out more about [structuring your data models](docs/Structure.md)

# CRUD Queries

`narwal` models can easily be queried for `SELECT`, `INSERT`, `UPDATE` and `DELETE` queries.

## INSERT INTO

```sql
INSERT INTO employees (first_name, last_name) VALUES ('John', 'Doe')
```

```js
narwal.models.Employee
  .insert({ "first_name": 'John', "last_name": 'Doe' });
```

## SELECT

```sql
SELECT email FROM employees WHERE first_name='John' AND last_name='Doe' LIMIT 10 ORDER BY email ASC
```

```js
narwal.models.Employee
  .find({ "first_name": 'John', "last_name": 'Doe' })
  .select("email")
  .limit(10)
  .sort("email");
```

## UPDATE

```sql
UPDATE employees SET first_name='John' WHERE last_name='Doe'
```

```js
narwal.models.Employee
  .update({ "first_name": 'John' })
  .where({ "last_name": 'Doe' });
```

## DELETE

```sql
DELETE FROM employees WHERE first_name='John' AND last_name='Doe'
```

```js
narwal.models.Employee
  .remove({ "first_name": 'John', "last_name": 'Doe' });
```

# JOIN

You can join models

```js
new narwal.Model('Player', {
  username:   String,
  score:      Number,
  team:       new narwal.Model('Team', { name: String, color: String })
});

narwal.models.Player
  .find({ "team": { "color": "red" } });
```

# Hooks

You can also `before` and `after` hooks on any operations:

```js
narwal.models.Player.before('insert', function (row, done) {
  fs.mkdir('users/' + row.id, done);
});

narwal.models.Player.after('remove', function (row, done) {
  fs.rmdir('users/' + row.id, done);
}
```

# Transactions

```js
new narwal.Transaction(function () {
  
  // Queries run here will force a rollback on error
  
  narwal.models.Player.insert() ...
});
```

# Stream support

# Migration

You can create or alter tables using models:

```js
narwal.models.Player.create({ alter: true });
```

You can keep track of your revisions such as:

```js
// v0
new narwal.Model('Player', { name: String }, { version: 0, revision: true });

// v1
// ALTER TABLE players ADD FIELD score INT
narwal.models.Player.structure.score = { type: Number };
narwal.models.Player.version = 1;

// v2
// ALTER TABLE players ADD FIELD email VARCHAR(255)
narwal.models.Player.structure.email = { type: String, validate: /^.+@.+$/ };
narwal.models.Player.version = 2;

// ...
```

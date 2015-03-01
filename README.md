n    a    r    w    a    l
==========================

## alpha - do not use (yet)

`narwal` (NodeJS) is a loosely coupled structure-data architecture for modeling and moving around your MySQL data.

# Install

```bash
npm install narwal
```

```js
var narwal = require('narwal');
```

# Structure abstraction

With `narwal` it's easy to modelize your data structure:

```js
new narwal.Model('Employee', {
  "first_name": {
    type: String,
    required: true
  },
  
  "last_name": {
    type: String,
    required: true
  },
  
  "email": {
    type: String
    validate: /^.+@.+$/
  },
  
  "dob": {
    type: Date
  },
  
  "active": {
    type: Boolean,
    default: false
  }
});
```

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
  .update({ first_name: 'John' })
  .where({ last_name: 'Doe' });
```

## DELETE

```sql
DELETE FROM employees WHERE first_name='John' AND last_name='Doe'
```

```js
narwal.models.Employee
  .remove({ first_name: 'John', last_name: 'Doe' });
```

# JOIN

You can specify JOIN tables in your models:

```sql
SELECT p.username, p.score, t.id, t.name 
    FROM players AS p
    JOIN teams AS t ON p.team = t.id
    WHERE t.name = 'red'
```

```js
new narwal.Model('Player', {
  username:   String,
  score:      Number,
  team:       new narwal.Model('Team', { name: String })
});

narwal.models.Player
  .find({ "team": { "name": "red" } })
  .join("team");
```

# HOOKS

You can also `before` and `after` hooks on any operations:

```js
new narwal.Model('Player', { score: Number, team: String });

narwal.models.Player.before('insert', function (row) {
  if ( row.team === 'red' ) {
    row.score = 100;
  }
});
```

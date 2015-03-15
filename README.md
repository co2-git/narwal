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

Find out more about [structuring your data models](docs/Structure.md).

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

Find out more about [inserting data](docs/Insert.md).

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

Find out more about [retrieving data](docs/Retrieve.md).

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

# Filters

Filters can handle complex `WHERE` statements

```sql
SELECT * FROM players 
  WHERE 
    first_name != 'John' 
  AND
    (last_name = 'Jackson' OR last_name REGEXP '^Smith')
  AND
    score > 100
  AND
    trial_expiration_date > NOW()
```

```js
var is = narwal.is;
var sql = narwal.sql;

narwal.models.Player
  
  .filter({
  
    "first_name":               is.not("John"),
    "last_name":                [ "Jackson", /^Smith/ ],
    "score":                    is.above(100),
    "trial_expiration_date":    is.after(sql('NOW()'))
  
  });
```

# Relations

It is easy to link different models together:

```js
// Join model Player with model Team

new narwal.Model("Team", { "color": String });

new narwal.Model("Player", { "username": String, "team": narwal.models.Team });

// Note that you can do deep-linking search:

narwal.models.Player
  // Find players which team's color is red
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
new narwal.Transaction(function (done) {
  
  // Queries run here will force a rollback on error
  
  // Call done() when done to commit the transaction
  
  
  // Example of a transaction:
  
  narwal.models.Team                  // Use Model "Team"
    
    .insert({ "color": "red" })       // Insert new team which color is red
    
    .then(function (newTeam) {       // Once new team created
      
      narwal.models.Player            // Use Model "Player"
        
        .insert({ "team": newTeam })  // Insert new player which team is the newly created team
        
        .then(                        // Once new player created
          done);                      // Commit transaction
      }
    );
  
});
```

Learn more about transactions [here](docs/Transactions.md)

# Stream support

# Migration

You can create MySQL tables from models:

```js
narwal.models.Player.create();
```

Specify `{ "alter": true }` to alter the table in case it already exists but has a different structure. If the table does not exists, it will be created.

```js
narwal.models.Player.create({ "alter": true });
```

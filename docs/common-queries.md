Common queries
==============

Here you can find a list of common MySQL queries along with their Narwal query equivalent.

# SELECT columns

## Default fields

By default, a find query will select all the fields declared in the Model structure plus the implicit fields `id`, `created` and `updated`.

```sql
SELECT id, name, score, created, updated FROM players;
```

```js
new narwal.Model('Player', {
    name: String,
    score: Number
  })
  .find();
```

## Omit implicit fields

You may not want the implicit fields to appear in your query. In this case, use `implicit` method:

```sql
SELECT name, score FROM players;
```

```js
new narwal.Model('Player', {
    name: String,
    score: Number
  })
  .implicit(false);
```

## Specify fields to select

You may not want to select all the fields from your Model's structure. Use `select` to specify which.

```sql
SELECT id, name, created, updated FROM players;
```

```js
new narwal.Model('Player', {
    name: String,
    score: Number
  })
  .select('name');
```

## Specify fields to select without implicit fields

```sql
SELECT name FROM players;
```

```js
new narwal.Model('Player', {
    name: String,
    score: Number
  })
  .implicit(false)
  .select('name');
```

# SELECT AS

By default, `narwal` uses the field name as declared in the structure. You could use aliases by picking the alias name as the field name, and specify real field name in the `field` property:

```sql
SELECT some_long_legacy_name AS name FROM players;
```

```js
new narwal.Model('Player', {
  'name': {
    'type': String,
    'field:' 'some_long_legacy_name'
}).find();
```

# INSERT

## Insert single row

```sql
INSERT INTO players (name, score) VALUES ('Lara', 100);
```

```js
new narwal.Model('Player', {
    name: String,
    score: Number
  })
  .insert({
    name: 'Lara',
    score: 100
  });
```

## Insert several rows

```sql
INSERT INTO players (name, score) VALUES ('Lara', 100), ('Chiyoko', 100);
```

```js
new narwal.Model('Player', {
    name: String,
    score: Number
  })
  .insert([
    {
      name: 'Lara',
      score: 100
    },
    
    {
      name: 'Chiyoko',
      score: 100
    }
  ]);
```

# UPDATE

## Regular update

```sql
UPDATE players SET score=100;
```

```js
new narwal.Model('Player', {
    name: String,
    score: Number
  })
  .update({ score: 100 });
```

## Regular update with regular filters

```sql
UPDATE players SET score=100 WHERE name='Lara';
```

```js
var model = new narwal.Model('Player', {
  name: String,
  score: Number
});


var query = model

  .update     ({ name: 'Lara' }, { score: 100 });
```

## Regular update with advanced filters

```sql
UPDATE players SET score=100 WHERE name!='Lara';
```

```js
var model = new narwal.Model('Player', {
  name: String,
  score: Number
});
  
var query = model

  .not          ({ name: 'Lara' })

  .update       ({ score: 100 });
```

## Increment

```sql
UPDATE players SET score=(score + 100);
```

```js
new narwal.Model('Player', {
    name: String,
    score: Number
  })
  .increment({ score: 100 });
```

## Decrement

```sql
UPDATE players SET score=(score - 100);
```

```js
new narwal.Model('Player', {
    name: String,
    score: Number
  })
  .decrement({ score: 100 });
```

## Advanced update

Use the `updateFunction` method to manually enter a complex setter:

```sql
UPDATE players SET score=(score * 100 + 10);
```

```js
new narwal.Model('Player', {
    name: String,
    score: Number
  })
  .updateFunction({ score: '(score * 100 + 10)' });
```

## Advanced update with string manipulation and fileter

```sql
UPDATE players SET name=UPPER(name) WHERE name!='Lara';
```

```js
new narwal.Model('Player', {
    name: String,
    score: Number
  })
  .updateFunction({ name: 'UPPER(name)' });
```

# CREATE

## Default fields

```sql
CREATE TABLE players (
  id          INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
  created     TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00', 
  updated     TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW()
);
```

```js
new narwal.Model('Player', {}).create();
```

Learn more about default fields `id`, `created` and `updated` [here](structure-md).

## Change `id` field name

If your id field is not named `id`, you can specify it in the model options.

```sql
CREATE TABLE players (
  player_id   INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
  created     TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00', 
  updated     TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW()
);
```

```js
new narwal.Model('Player', {}, { id: 'player_id' });
```

## No `id` field

If your table does not need an id, use `{ id: false }`.

```sql
CREATE TABLE players (
  player_id   INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
  created     TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00', 
  updated     TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW()
);
```

```js
new narwal.Model('Player', {}, { id: false });
```

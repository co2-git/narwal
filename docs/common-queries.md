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

## Omit default fields

You may not want the default fields to appear in your query. In this case, use `unselect` method:

```sql
SELECT name, score FROM players;
```

```js
new narwal.Model('Player', {
    name: String,
    score: Number
  })
  .unselect('id', 'created', 'updated');
```

## Specify fields to select

You may not want to select all the fields from your Model's structure. Use `select` to specify which.

```sql
SELECT name FROM players;
```

```js
new narwal.Model('Player', {
    name: String,
    score: Number
  })
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

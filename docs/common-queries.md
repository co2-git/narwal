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

You may not want the default fields to appear in your query. In this case, use `select` method:

```sql
SELECT name, score FROM players;
```

```js
new narwal.Model('Player', {
    name: String,
    score: Number
  })
  .select({ id: false, created: false, updated: false });
```

## Specify fields to select

You may not want to select all the fields from your Model's structure. Use `select` to specify which

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

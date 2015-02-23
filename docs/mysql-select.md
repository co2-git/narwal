Common queries
==============

Here you can find a list of common MySQL SELECT queries along with their Narwal query equivalent.

# SELECT columns

## Default fields

By default, a find query will select all the fields declared in the Model structure plus the implicit fields `id`, `created` and `updated`.

```sql
SELECT id, name, score, created, updated FROM players;
```

```js
var model = new narwal.Model('Player', {
  name: String,
  score: Number
});

var query = model.find();
```

## Omit implicit fields

You may not want the implicit fields to appear in your query. In this case, use `unselect` method with no arguments:

```sql
SELECT name, score FROM players;
```

```js
var model = new narwal.Model('Player', {
  name: String,
  score: Number
});

var query = model.unselect();
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
  .unselect()
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

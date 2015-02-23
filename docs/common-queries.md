Common queries
==============

Here you can find a list of common MySQL queries along with their Narwal query equivalent.

# SELECT columns

By default, a find query will select all the fields declared in the Model structure.

<big style="background: black; color: #fff; font-weight: bold; font-family: 'Courier New', Courier, sans-serif">SQL</big>

# CREATE

## Default fields

```sql
CREATE TABLE players (
  id          INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
  created     TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00', 
  updated     TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW()
);
```

<big style="background: black; color: #fff; font-weight: bold; font-family: 'Courier New', Courier, sans-serif">JS</big>

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

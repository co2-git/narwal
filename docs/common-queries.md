Common queries
==============

Here you can find a list of common MySQL queries along with their Narwal query equivalent.

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

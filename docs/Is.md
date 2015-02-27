n a r w a l . I s
=================

`Is` is Narwal query conditions builder. It offers a comprehensive syntax to emulate the `WHERE` statement in `MySQL`.

`Is` comes handy everytime you have to handle a query too complex for an object notation.

This is a simple query that can be handled by a simple object:

#### MySQL

```sql
SELECT name FROM players WHERE name = 'Lara':
```

#### Narwal

```js
Player.find({ name: 'Lara' });
```

Now, let's say you want to perform this query:

```sql
SELECT name FROM players WHERE name != 'Lara':
```

Or this one:

```sql
SELECT score FROM players WHERE score > 100:
```

Or even this one:

```sql
SELECT name, avatar FROM players WHERE name = avatar:
```

Heck! These ones too:

```sql
SELECT score, points FROM players WHERE score = (points / 2);

SELECT * FROM players WHERE CONCAT(first_name, last_name) = LOWER('John Doe');
```

This is where `is` comes in to offer you more grain control:

```js
var is = narwal.is;

Player.find({ "name": is.not('Lara') });

Player.find({ "score": is.above(100) });

Player.find({ "name": is.field("avatar") });

Player.find({ "score": is.sql('(?? / 2)', 'points') });

Player
  
  .map({ "full_name": map.concat('first_name', 'last_name') })
  
  .find({ "full_name": is.sql('LOWER(?)', 'John Die') });
```

# `is`

```sql
SELECT name FROM players WHERE score = 100;
```

```js
new narwal.Model('Player', { name: String, score: Number })

  .filter({ score: is(100) });
```

# `not`

```sql
SELECT name FROM players WHERE score != 100;
```

```js
new narwal.Model('Player', { name: String, score: Number })

  .filter({ score: is.not(100) });
```

# `above`

```sql
SELECT name FROM players WHERE score  > 100;
```

```js
new narwal.Model('Player', { name: String, score: Number })

  .filter({ score: is.above(100) });
```

# `somehow above`

```sql
SELECT name FROM players WHERE score  >= 100;
```

```js
new narwal.Model('Player', { name: String, score: Number })

  .filter({ score: [is(100), is.above(100)] });
```

# `below`

```sql
SELECT name FROM players WHERE score  < 100;
```

```js
new narwal.Model('Player', { name: String, score: Number })

  .filter({ score: is.below(100) });
```

# `somehow below`

```sql
SELECT name FROM players WHERE score <= 100;
```

```js
new narwal.Model('Player', { name: String, score: Number })

  .filter({ score: [is(100), is.below(100)] });
```

n a r w a l . I s
=================

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

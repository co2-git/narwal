MySQL Where - Narwal Equivalents
================================

# Simple assertion

```sql
SELECT * FROM players WHERE name='Lara';
```

```js
var query = Player.filter({ name: 'Lara' });
```

# And assertion

```sql
SELECT * FROM players WHERE name='Lara' AND score=100;
```

```js
var query = Player.filter({ name: 'Lara', score: 100 });
```

# Not assertion

```sql
SELECT * FROM players WHERE name!='Lara';
```

```js
var query = Player.not({ name: 'Lara' });
```

# Or assertion with same field

```sql
SELECT * FROM players WHERE name='Lara' OR name='CHiyoko';
```

```js
var query = Player.filter({ name: ['Lara', 'Chioko'] });
```

# Or assertion with different fields

```sql
SELECT * FROM players WHERE name='Lara' OR score=100;
```

```js
var query = Player.filter([{ name: 'Lara' }, { score: 100 }]);
```

# Nested assertion

```sql
SELECT * FROM players WHERE (name='Lara' AND score=100) OR (A=1 AND B=2);
```

```js
var query = Player.filter([{ name: 'Lara', score: 100 }, { A:1, B:2 }]);
```

# Nested assertion 2

```sql
SELECT * FROM players WHERE ((name='Lara' AND score=100) OR (name='CHiyoko' AND score=200)) AND (A=1 OR A=2);
```

```js
var query = Player.filter([{ name: 'Lara', score: 100 }, { name: 'Chiyoko', score: 200 }], { A:[1,2] } );
```

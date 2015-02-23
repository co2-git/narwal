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
var is = narwal.is;

var query = Player.filter({ name: is.not('Lara') });
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
SELECT * FROM players WHERE name='Lara' OR score=100 OR score>500;
```

```js
var is = narwal.is;

var query = Player.filter([{ name: 'Lara' }, { score: 100 }, { score: is.above(500) }]);
```

# Nested assertion

```sql
SELECT * FROM players WHERE (name='Lara' AND score=100) OR (A=1 AND A=2);
```

```js
var query = Player.filter( [ { "name": "Lara", "score": 100 }, { "A": 1, "B": 2 } ] );
```

# Above

```sql
SELECT * FROM players WHERE score>100;
```

```js
var is = narwal.is;

var query = Player.filter({ score: is.above(100) });
```

# Below

```sql
SELECT * FROM players WHERE score<100;
```

```js
var is = narwal.is;

var query = Player.filter({ score: is.below(100) });
```

# JOIN

```sql
SELECT * FROM players JOIN teams ON players.team = teams.id WHERE teams.name!='Red' AND players.score>1000;
```

```js
var is = narwal.is;

var model = new narwal.Model('Player', {
  score: Number,
  team: new narwal.Model('Team', { name: String })
});

var query = Player.filter({ team: { name: is.not('Red'), score: is.above(1000) } });
```

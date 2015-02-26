Structure
=========

This holds the structure (fields) representation of a table. **Note that the tables must exists and their structure must match**.

# Types

## Default types

`narwal` lets you specify three basic types by matching them to JavaScript built-in objects:

- `String` <=> `VARCHAR(255)`
- `Number` <=> `INT(11)`
- `Date` <=> `TIMESTAMP`

```js
new narwal.Model('Player', {
  name: String,
  score: Number,
  joined: Date
});
```

## Advanced types

MySQL has a lot of types: you can write them directly:

```js
new narwal.Model('Player', { lat: 'DECIMAL(6,9)' });
```

## References

By setting a field type to another model, the two models will be joined:

```js
new narwal.Model('Player', { team: new narwal.Model('Team') });
```

# Default values

# Validators

# Required

# String syntax

If you want to target only one column of the table and this column is of type `varchar` you can use this shortcut syntax:

```js
new narwal.Model('Player', 'name')
```

This is the equivalent of:

```js
new narwal.Model('Player', { 'name': { type: String } });
```

# Array syntax

If you want to target only columns of the table and these columns are all of type `varchar` you can use this shortcut syntax:

```js
new narwal.Model('Player', ['name', 'quote']);
```

This is the equivalent of:

```js
new narwal.Model('Player', { 'name': { type: String }, 'quote': { type: String } });
```

# Object syntax

## Type syntax

If you just want to define the type of the field, you can use the following syntax:

```js
new narwal.Model('Player', { name: String, score: Number });
```

This is the equivalent of:

```js
new narwal.Model('Player', { 'name': { type: String }, 'score': { type: Number } });
```

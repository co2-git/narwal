Structure
=========

This holds the structure (fields) representation of a table. **Note that the tables must exists and their structure must match**. See the [Migration Section](docs/Migration.md) for creating and altering structure.

# Fields

Structure is a list of fields which syntax is:

```js
{
  "field_1": Field,
  "field_2": Field,
  ...
}
```

# Field

`Field` is an object that has the following properties:

| Property | Type | Description | Example | Default |
|----------|------|-------------|---------|---------|
| `type` | `Mixed` | The field's data type | `{ type: String }` | `String` |
| `required` | `Boolean` | Whether or not this field is required on `insert` queries | `{ required: true }` | `false` |
| `validate` | `Mixed` | A validator that must be complied with on `insert` and `update` queries | `{ validate: "10..15" }` |

# Type

## Native type

We match some JavaScript native types with some MySQL types:

| JavaScript types | MySQL types |
|------------------|-------------|
| { type: String } | VARCHAR(255) |
| { type: Number } | INT(11) |
| { type: Date } | TIMESTAMP |
| { type: Boolean } | TINYINT(1) |
| { type: Buffer } | BINARY |

```js
new narwal.Model('Player', {
  "name":   String,
  "score":  Number,
  "dob":    Date,
  "active": Boolean
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

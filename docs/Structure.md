Structure
=========

This holds the structure (fields) representation of a table. **Note that the tables must exists and their structure must match**. See the [Migration Section](docs/Migration.md) for creating and altering structure.

# Fields

Structure is a list of fields which syntax is:

```js
var structure = { "field 1": Field, "field 2": Field };

new narwal.Model('My Model', structure);
```

# Field

`Field` is an object that has the following properties:

| Property | Type | Description | Example | Default |
|----------|------|-------------|---------|---------|
| [`type`](#type) | `Mixed` | The field's data type | { "type": `String` } | `String` |
| [`required`](#required) | `Boolean` | Whether or not this field is required on `insert` queries | `{ required: true }` | `false` |
| `validate` | `Mixed` | A validator that must be complied with on `insert` and `update` queries | `{ validate: "10..15" }` | `undefined` |
|

# <a name="type"></a>Type

## Native type

We match some JavaScript native types with some MySQL types:

| JavaScript types | MySQL types |
|------------------|-------------|
| `String` | VARCHAR(255) |
| `Number` } | INT(11) |
| `Date` } | TIMESTAMP |
| `Boolean` } | TINYINT(1) |
| `Buffer` } | BINARY |

```js
new narwal.Model('Player', {
  "name":   String,       // FIELD name VARCHAR(255)
  "score":  Number,       // FIELD score INT(11)
  "dob":    Date,         // FIELD dob TIMESTAMP
  "active": Boolean       // FIELD active TINYINT(1)
});
```

## Advanced types

Any other MySQL types can be typed:

```js
                            // FIELD lat DECIMAL(6,9)
new narwal.Model('Player',  { lat: 'DECIMAL(6,9)' });
```

We will soon incorporate an API that covers all MySQL data types and that will have the following syntax:

```js
new narwal.Model('Player', { lat: narwal.Types.Decimal(6, 9) }
```

## Alternative type declaration syntaxes

## Single text field

A structure that only has one field which data type is `String` can be declared such as:

```js
new narwal.Model('Player', 'name');

// which is sugar for
new narwal.Model('Player', { 'name': { 'type': String } });
```

# <a name="required"></a>Required

You can require fields. These fields will be required to have for data waiting to be inserted.

```js
new narwal.Model('Player', {
  'name': {
    'required': true
  }
});

// Inserting a player without the 'name' field will throw an error

narwal.models.Player.insert({});

// [ NarwalError: Player::insert => Missing required field 'name' ]
```

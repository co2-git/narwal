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

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| [type](#type) | `Mixed` | The field's data type | `String` |
| [required](#required) | `Boolean` | Whether or not this field is required on `insert` queries | `false` |
| [validate](#validate) | `Mixed` | A validator that must be complied with on `insert` and `update` queries | `undefined` |
| [default](#default) | `Mixed` | A default value to be applied on `insert` and `update` queries | `undefined` |
| [comment](#comment) | `String` | A comment explaining the field's role | `undefined` |
| [null](#null) | `Boolean` | Whether or not field accepts null values | `false` |

# <a name="type"></a>Type

## Native type

We match some JavaScript native types with some MySQL types:

| JavaScript types | MySQL types |
|------------------|-------------|
| `String` | VARCHAR(255) |
| `Number` | INT(11) |
| `Date` | TIMESTAMP |
| `Boolean` | TINYINT(1) |
| `Buffer` | BINARY |

```js
new narwal.Model('Player', {
  "name":   { "type": String },       // FIELD name VARCHAR(255)
  "score":  { "type": Number },       // FIELD score INT(11)
  "dob":    { "type": Date },         // FIELD dob TIMESTAMP
  "active": { "type": Boolean }       // FIELD active TINYINT(1)
});
```

## Advanced types

Any other MySQL types can be typed:

```js
new narwal.Model("Player", {
  "lat": {            
    "type": "DECIMAL(6,9)"          // FIELD lat DECIMAL(6,9)
  }
});
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

# <a name="valdiate"></a>Validate

You can define a validator for a field. The validator is called during `insert` and `update` queries. The validator must return `true`. Invalid data (`false`) will interrupt the query pipeline.

## Regular expression

You can validate a regular expression. For example, make sure that all urls begin by `https://`:

```js
new narwal.Model('Player', {
  "url": {
    "type": String,
    "validate": /^https:\/\//,
  });
  
// Invalid data will throw an error

narwal.models.Player.insert({ url: 'http://example.com' });

// [ NarwalError: Player::insert => Validation failed for field 'url' (regex failed) ]
```

## Function

Validators can be passed as a function.

Note that validators are **synchronous**. If you want to do **asynchronous** validation, use the [Hooks](docs/Hooks.md).

```js
new narwal.Model('Player', {
  "number": {
    "type": Number,
    "validate": function (data) {
      // Numbers must be between 5 and 15
      return (data >= 5) && (data <= 15);
    },
  });
  
// Invalid data will throw an error

narwal.models.Player.insert({ "number": 100 });

// [ NarwalError: Player::insert => Validation failed for field 'number' ]
```

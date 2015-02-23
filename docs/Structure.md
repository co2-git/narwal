Structure
=========

This holds the structure (fields) representation of a table. **Note that the tables must exists and their structure must match**.

# The one-column table structure

If you want to target only one column of the table and this column is of type `varchar` you can use this shortcut syntax:

```js
new narwal.Model('Player', 'name')
```

This is the equivalent of:

```js
new narwal.Model('Player', { 'name': { type: String } })
```

n   a   r   w   a   l
=====================

`narwal` is a model library for MySQL

# Install

```bash
npm install narwal
```

# Usage

## Define a model

```js
var narwal = require('narwal');

var Category = new narwal.Model('Category',{
  
  'title': {
    type: String,
    required: true
  }

});
```

## Select

```js
Category
  .find()
  .forEach(function (category) {
    // ...
  });
```

## Select ... WHERE

```js
Category
  .find({ title: 'Sport' })
  .forEach(function (category) {
    // ...
  });
```

## Select ONE

```js
Category
  .findOne({ title: 'Sport' })
  .then(function (category) {
    // ...
  });
```

## Insert

```js
Category
  .insert({ title: 'Music' })
  .then(function () {
    // ...
  });
```

## Update

```js
Category
  .update({ title: 'Music' }, { title: 'Music & Video' })
  .then(function () {
    // ...
  });
```

## Delete

```js
Category
  .remove({ title: 'Music & Video' })
  .then(function () {
    // ...
  });
```

## JOIN TABLE

```js
var narwal = require('narwal');
var Category = require('./Category');

var Product = new narwal.Model('Product',{
  
  'title': {
    type: String,
    required: true
  },

  'category': Category,

  'price': {
    type: Number,
    required: true
  }

});

//  SELECT * FROM products
//  JOIN categories ON categories.id = products.category
//  WHERE categories.title = 'Sport'

Product
  
  .find({ category: { title: 'Sport' } })

  .forEach(function (product) {

  });

```


# Data types

| Type      | MySQL           |
|-----------|-----------------|
| String    | VARCHAR(255)    |
| Number    | INT(11)         |
| Date      | TIMESTAMP       |
|-----------|-----------------|

# Dynamic data types

| Type                      | MySQL           |
|---------------------------|-----------------|
| narwal.Types.Varchar(n)   | VARCHAR(n)      |
| narwal.Types.Int(n)       | INT(n)          |
|---------------------------|-----------------|
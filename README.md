n   a   r   w   a   l
=====================

`narwal` is a Object Model library for MySQL.

# Install

```bash
npm install narwal
```

# Usage

First, create models of your database structure. Let's take the infamous `employees` table:


```js

var narwal = require('narwal');

var Employee = new narwal.Model('Employee', {
  
  'first_name': {
    type: String,
    required: true
  },

  'last_name': {
    type: String,
    required: true
  },

  'dob': {
    type: Date,
    required: true
  }

});
```

Now it's easy to query your Employee model:

```js
// SELECT * FROM employees

Employee.forEach(function (employee) {
  // ...
});

// UPDATE employees SET last_name='Johnson' WHERE last_name='Jackson';

Employee.update({ last_name: 'Jackson' }, { last_name: 'Johnson' });

// INSERT INTO employees VALUES('Chihiro', 'Ono')

Employee.insert({ first_name: 'Chihiro', last_name: 'Ono' });

// DELETE FROM employees WHERE last_name='Johnson';

Employee.remove({ last_name: 'Johnson' })

```

# The Model

```js
new narwal.Model(String, Object, Object);
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
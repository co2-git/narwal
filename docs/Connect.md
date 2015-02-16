# Connect

## Default credentials

If you refer to the Model section above, you will see that `narwal` connects by default to `mysql://root@localhost/test`.

## Auto-connect

When executing a query, `narwal` will try to connect. If you would use default credentials (which you should not for security reasons), you wouldn't need to call a `connect` method:

```js
// work as is
var model = new narwal.Model('User', {});
// mysql://narwal@localhost/narwal/users
model.find().forEach(function (user) {});
```

## Credentials format

Credentials can be passed either a string following the URL format as so:

    mysql://user:password@host:port/dbname
    
Or as an object such as:

```js
var credentials = {
  "host": String,
  "port": Number,
  "user": String,
  "password": String,
  "dbname": String
};
```

## Ways to connect

To specify another credentials, you have two choices:

### Use cache

You can benefit from npm internal cache mechanism and connect directly from the module:

```js
var narwal = require('narwal');

narwal.connect('mysql://some-other-host');

// Now in runtime, you don't need to specify again a connexion link

var Player = require('../models/Player');

// Your query will be executed with the declared credentials

Player.find();
```

### Model level

You can also connect at model level:

```js
var Player = require('../models/Player');

Player
  .connect(credentials)
  .find();
```

You can switch connections:

```js
var Player = require('../models/Player');

var rows;

Player
  
  // Connect to DB 1
  
  .connect(credentials1)
  
  // SELECT
  
  .find()
  
  // On results
  
  .found(function foundPlayers (players) {
    Player
      
      // Connect to DB2
      
      .connect(credentials2)
      
      // Insert results
      
      .insert(players);
  });
```

If you declare connexions both on module level and on model level, model level will have precedence.

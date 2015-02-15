# The Query

The query is an emitter. It emits an error event on failure and a success event otherwise.

```js
Player
  
  .find()
  
  .on('error', function findPlayerError (error) {
    throw error;
  })
  
  .on('success', function findPlayerSuccess (players) {
    console.log(players.length);
  })
```

Or you can use the convenient methods `error` and `success`:

```js
Player

  .find()
  
  .error(function findPlayerError (error) {
    throw error;
  })
  
  .success(function findPlayerSuccess (players) {
    console.log(players.length);
  });
```

Or the `then` method:

```js
Player

  .find()
  
  .then(
    function findPlayerThen (players) {
      console.log(players.length):
    },
    
    function findPlayerThenError (error) {
      throw error;
    }
  );
```

Or you can use the callback syntax:

```js
Player

  .find(function findPlayerCallback (error, players) {
    if ( error ) {
      throw error:
    }
    
    console.log(players.length);
  });
```

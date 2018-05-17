# Events
This part is under maintenance.  

Currently still out of idea for this part.
You can use the `run..forever` keyword.
```js
@iofunction
main -> Void
    let request = await listenRequest
    let response = 
        .status = 200 if request.target == "/home" else 404
        .body   = await read ./index.html 
    reply response to request.origin

run main forever
```
```js
when myButton isClicked
    set .color  of myButton to "red"
    set .height of myButton to 123
```


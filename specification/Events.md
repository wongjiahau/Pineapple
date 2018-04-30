# Events
Event can be constructed using `when` keyword.
```js
when request arrives
    response = 
        .status = 400
        .body   = await read ./index.html 
    reply response to request.origin
```
```js
when myButton isClicked
    set .color  of myButton to "red"
    set .height of myButton to 123
```


# Input and Output
In `Pineapple`, every call to an input function must be annotated with the `await` keyword.

However, calling an output function is not needed to be annotated with `await`.

For example,

```js
let input = await readLine
print "Hello world"

let anotherInput = readLine // Error

await print "Hello world" // Error
```

## Function that involve IO operation
As mentioned in the Function.md section, every function that involve I/O operation must be annotated with `@iofunction`.
```js
@iofunction
askForName -> String
    print "What is your name?" 
    let result = await readLine
    -> result
```
Note that, if you call a function that contains `await`, you must also await that function too.

For example, 
```js
let name = await askForName
```

We need to await `askForName`, because there are some statement that is awaiting within that function.

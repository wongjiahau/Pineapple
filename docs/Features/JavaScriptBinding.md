# JavaScript binding

Since Pineapple is a function that compiles to Javascript, you can easily use Javascript functions within Pineapple.

To create a function that call native JS function, you need to:  

- use the `<javascript>` tag  

- prepend dollar sign `$` to parameters

For example:

```pine
// Example 1
def (this Any).show
    <javascript>
    console.log($this)
    </javascript>


// Example 2
def (this Number) ^ (that Number) -> Number
    <javascript>
    Math.pow($this, $that)
    </javascript>
```

Not only that, it is also possible to use Node's `#!js require` to import 3rd party modules.

```pine

def (filename String).open -> String
    <javascript>
    const fs = require("fs")
    return fs.readFileSync($filename);
    </javascript>
```

---

## Binding asynchronous functions

To bind to a callback function, you need to use the `#!pine async` keyword.  
Furthermore, you must return a Promise.

For example,

```pine
def async (question String).ask -> String
    <javascript>
    const readline = require('readline');

    const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
    });

    return new Promise((resolve, reject) => {
        rl.question($question, (message) => {
            resolve(message);
            rl.close();
        });
    })
    </javascript>
```

And to use it, you don't need to use `async` or `await` keyword, just treat it as a normal function!

```pine
def .main // no need to annotate `async` here
    let name = "What is your name? ".ask // no need to annotate it with `await`
    "Hello $(name)!".show
```
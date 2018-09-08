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

```pine
def async .readline -> String
    pass
```
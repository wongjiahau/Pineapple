# Variables

To create a variable, you need to use the `#!pine let` keyword:

```pine
let myVariable = "Hello World!"
```
 
!!! info "Note"
    Every variable in Pineapple must start with ==lowercase letter== and cannot contain any spaces or underscore.  
    The following are invalid variable names:

    ```pine
    let Message = "Yo" // Invalid, cannot start with uppercase letter

    let my name = "Wong" // Invalid, cannot contain spaces

    let my_pet = "Cat" // Invalid, cannot contain underscore
    ```

---

## Type inference

The type of each variables are resolved automatically by the Pineapple compiler, so you don't need to provide any type annotation.  
For example:

```pine
let x = "yo"    // x has type of String
let y = 0       // y has type of Integer
let z = [1,2,3] // z has type of List{Integer}
```

Although unnessecary, it is also possible to annotate variables with type manually:

```pine
let x String = "yo"
```
<hr>

## Default immutability

By default, ==all variables in Pineapple are immutable==, it means that you cannot assign a new value to it after you declare it.

```pine
let count = 0
count = 1 // Error
```

!!! info "Info"
    *Mutable* means *changeable*.  
    *Immutable* means *not changeable*.

If you wish to make a variable mutable, you need to use the `mutable` keyword.

```js
let mutable x = 0
x = 1 // No error
```

!!! tip
    This feature is implemented on purpose to discourage programmers from mutating variables all the time.  
    So, instead of creating one variables and change it all the time, ==create as many variables as you want!==


## Default non-nullablility

By default, you cannot assign `#!pine #nil` to a mutable variable.

```pine
let mutable x = 0
x = #nil // Error
```

!!! question "What is nil?"
    Nil is actually same as null, just that *nil* is easier to type, so *nil* is adapted in Pineapple.

If you want to assign `#!pine #nil` to a variable, you need to declare it explicitly by using nilable types (which is to add a question mark behind the type name).

```pine
let mutable x Int? = 0
x = #nil // No error
```

<hr>

## Pass by value

When you try to assign the value of one variable to another variable, the value is copied, instead of copying its reference.  

For example,
```js
let john = People
    :name = "John"
    :age  = 99

let newJohn = john // copy john to newJohn

newJohn:name = "Johnny Bravo"

john:name.show // Still "John"
```

!!! question "Why?"
    This feature is to prevent programmer from facing crazy bugs caused by pass-by-reference.

<hr>

### Optimization (implementing)
Of course, pass-by-value is expensive, thus it might slows down the program performance.  
Fortunately, the Pineapple compiler will use pass-by-reference whenever possible.  

For example:
```js
let x = 10
let y = x // x's value is pass-by-reference since it is not used afterwards
y.show
```

Another example:
```js
let x = 10
let y = x // x's value is pass-by-value, since it is still in used after this line
x.show
y.show
```
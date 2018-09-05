# Variables
To create a variable, you need to use the `let` keyword:
```js
let myVariable = "Hello World!"
```

## Type inference
The type of each variables are resolved automatically by the Pineapple compiler, so you don't need to provide any type annotation.  
For example:
```js
let x = "yo"    // x has type of String
let y = 0       // y has type of Int
let z = [1,2,3] // z has type of List{Int}
```
Although unnessecary, it is also possible to annotate variables with type manually:
```js
let x String = "yo"
```


## Default immutability
By default, all variables in Pineapple are immutable, it means that you cannot assign a new value to it after you declare it.
```js
let count = 0
count = 1 // Error
```

If you wish to make a variable mutable (aka. change-able), you need to use the `mutable` keyword.
```js
let x mutable = 0
x = 1 // No error
```
This feature is implemented on purpose to discourage programmers from mutating variables all the time.  
So, instead of creating one variables and change it all the time, **you should create as many variables as you want**!

## Default non-nullablility
By default, you cannot assign ``nil` to a mutable variable.
```
let x mutable = 0
x = `nil // Error
```
If you want to assign ``nil` to a variable, you need to declare it explicitly by using Nullable types.
```
let x Int? mutable = 0
x = `nil // No error
```

## Pass by value
When you try to assign the value of one variable to another variable, the value is copied, instead of copying its reference.  

For example,
```js
let john = People
    'name = "John"
    'age  = 99

let newJohn = john

newJohn'name = "Johnny Bravo"

john'name.show // Still "John"
```
This feature is to prevent programmer from facing crazy bugs caused by pass-by-reference.

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
# Built-in types

## Introduction

Pineapple has special support for the following types:

- `#!pine Boolean`

- `#!pine Nil` (also known as null)

- `#!pine Number` and `#!pine Integer` 

- `#!pine String`

- `#!pine List` (also known as array)

- `#!pine Tuple` (also known as array)

- `#!pine Table` (also known as Dictionary or HashMap)

---

## Boolean

Boolean types in Pineapple can be declared using `#!pine #true` and `#!pine #false`.  

```pine
let isHappy = #true
let isSad   = #false
```

Boolean type is necessary for using [control statements](./025-ControlFlowStatements.md) such as `if-else` or `while` loop.

For example,

```pine
let isMad = #true

if isMad 
    "Oh my goodness".show
else
    "Thank goodness".show
```

---

## Nil

Nil type is useful when you are not sure what to assign for a variable.

```pine
let car = #nil // This means that you dont have a car
```

!!! info "Note"
    By default, you cannot assign `#!pine #nil` to any variable. Check out [Variables](./020-Variables.md) for more information.

--- 

## Number and Integer

```pine
let x = 123 // Will be inferred as Integer
let y = 123.4 // Will be inferred as Number
```

!!! info
    Integer is any number that do not contains decimal values. It is especially useful for counting things, for example `#!pine numberOfFruits` should be Integer instead of Number.

--- 

## String

In Pineapple, strings are enquoted using double quotes.

```pine
let message = "Hello world"
```

### String interpolation

You can also interpolate expressions into string using `$()`. 

```pine
let fruit = "Pineapple"
let howMany  = 5 + 9

let message = "I like to eat $(fruit) every $(howMany.toString) days"

message.show // I like to eat Pineapple 5 days
```

!!! info "Note"
    Every interpolated expression must have type of String, if not the Pineapple compiler will complain about it.  

    For example,
    
    ```pine
    let x = 23.4
    let message = "My number is $(x)" // Error, `x` should be String, but it is Number
    ```

    To prevent such problem, you have to use the `#!pine .toString` function.

!!! warning
    Interpolated expression cannot be raw string. For example,

    ```pine
    let y = "$("yo")" // Syntax error
    ```

---

## List

List are useful for storing more than one elements. To create a list in Pineapple, you need to use square brackets `[` `]` and comma `,` .

```pine
// Create list of integers
let xs = [1,2,3,4]

// You can pass in any expression as element
let x = 99
let numbers = [.pi, 3 + 3, 7.square, x]
```

List in Pineapple are homogeneous, it means that all elements within a list must be the same type. For example,

```pine
let x = [1, "2"] // Error, the second element should be Integer
```

!!! warning
    You cannot create an empty list by using `[]`. Instead you need to use the `#!pine List` constructor.

    ```pine
    let xs = [] // error

    let ys = List{Integer} // No error
    ```

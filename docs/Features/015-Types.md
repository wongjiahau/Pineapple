# Built-in types

## Introduction

Pineapple has special support for the following types:

- `#!pine Boolean`

- `#!pine Number` and `#!pine Integer` 

- `#!pine String`

- `#!pine Table` (also known as Dictionary or HashMap)

- `#!pine List` (also known as array)

- `#!pine Nil` (also known as null)

---

## Boolean

Boolean types in Pineapple can be declared using `#!pine #true` and `#!pine #false`.  

```pine
let isHappy = #true
let isSad   = #false
```

Boolean type is necessary for using [control statements](./ControlFlowStatements.md) such as `if-else` or `while` loop.

For example,

```pine
let isMad = #true

if isMad 
    "Oh my goodness".show
else
    "Thank goodness".show
```

---

## Number and Integer

```pine
let x = 123 // Will be inferred as Integer
let y = 123.4 // Will be inferred as Number
```

!!! warning
    Negative number are not implemented yet in Pineapple.
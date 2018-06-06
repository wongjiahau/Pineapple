# Main features
## 1. Infix/Suffix/Mixfix functions
```java
Example of function declaration:
// Infix
function
$x:Number plus $y:Number >> Number
    >> $x + $y

// Suffix
$howMany:Int minutes >> Duration
    >> newDuration ($howMany * 60)

// Mixfix
split $target:String by $separator:String >> String[]
    throw `Not implemented yet`
```

Example of function invocation:
```js
let $three = 1 plus 2

let $breakDuration = 15 minutes

let $names = split `John,Mary,Joe` by `,`
```

## 2. Strong typing with null check 
```ts
let $x:String = nil // Error

let $y:String? = nil // No error

let $z:String = 123 // Error: Wrong type
```

## 3. Pure functions
Every function cannot access variable out of its scope, and they cannot mutate the input.
```java
let $x = 5

function 
addTwo >> Number
    >> $x + 5 // Error, $x is not a variable
```

## 4. Pineapple Object Notation
A more readble JSON.
```js
let $myObject = 
    .name  = `pineapple`
    .price = 999
    .friends = 
        `apple`
        `banana`
        `pear`
    .taste = 
        .sweet  = true
        .bitter = false

print $myObject.friends.{2} // `banana`

print $myObject.taste.sweet // true
```

## 5. Javascript interop
For example, the following Pineapple code:
```java
function 
split $target:String by $separator:String >> String[]
    //js-start
    return ($target).split($separator);
    //js-end
```
Will be transpiled to:
```js
function split_by_($target, $separator) {
    return $target.split($separator);
}
```

## 6. Design by contract
You can do that by using the `makesure` keyword
```java
function 
factorial $x:Int >> Int
    makesure $x > 0
    if $x <= 1 
        >> 1
    else 
        >> $x * (factorial ($x - 1))

// Calling the factorial function
let result = factorial (-1) // Compile error: violation of rule "makesure $x > 0"
```

## 7. Differentiation between binding and assignment
Binding is using `=` symbol while assignment is using `<<` symbol.
```js

let $x = 6
$x = 7 // Compile error

let $y << 7
$y << 8 // No error
```
# Variables
To declare a variable, you need to use the `let` keyword.

## Binding 
In Pineapple, the equal symbol ( `=` ) does not stands for assignment, however it stands for binding. And once you bind a name with a value, you cannot rebind it again.
```php
let $x = 4
$x = 5 // Error: $x is already binded to the value `4`

let $people = 
    .name = "John"
    .age  = 123

$people.name << "Ali" # Error: `people.name` is already binded to the value "John"
```

## Assignment
You can declare a variable by using the left arrow operator (`<<` ).
```php
let $x << 5
$x << 6 // No error

let $people = 
    .name << "John"
    .age = 5

$people.name << "Ali" # No error
```

## Why we need to separate the concept of binding with assignment?
This is to reduce one of the WTFs, which is **WTF did my variable's value changed?**

This will allow programmer to debug their code easily.  

For example, let say we have a `Fruit` type, and we knew that it's `price` will be changed in the future.
```ts
type Fruit
    .name  : String
    .price : mutable Number
```
Now, let say in our main program we created a new `Fruit` object.
```ts
let $myFruit : Fruit = 
    .name  = `Pineapple`
    .price = 88 // Error: must used the `<<` operator because `.price` is mutable
```
The example above will have **compile error** (as commented).

So how do we fix this?

Easy, just by changing the binding operator (`=`) to assignment operator (`<<`) .
```ts
let $myFruit : Fruit =
    .name   = `Pineapple`
    .price << 88 // No error

$myFruit.price << 99 // No error
```
But, you may ask *'How can this idea help me to debug my code?'*.  
The answer is simple,  **just look for the `<<` symbol** !  

Just remember:
```
All the unexpected things happens
    when we change the value of a variable.
```

## Smart detection
Not only you can't re-assign value to a binded variable, you also can't use assignment on a variable which its future value is not changed!  For example:  
```php
let $x << 5 // Warning: The value of `x` is not reassigned, please consider changing `<<` to `=`.

let $y << 6
$y << 7
```

## How to specify type?
You can also specify type when declaring a variable by using colon (`:`) . It's just like Typescript.
```ts
let x : Number = 2
let y : Number = `123` // Error
```

## How to specify mutable variable?
```ts
// Original way
let x : mutable String << `123`

// Shortcut
let x << `123`
```

## Naming Rules
- All variable names must consist of only alphanumeric characters 
- All variable name must start with dollar sign `$`. 

`PascalCase` is reserved for declaring new types.   

All other naming convention such as `snake_case` or `kebab-case` are forbidden.

## Example

|Variable Name|Valid or not|  
|--|--|  
|`$x`|valid|  
|`$1`|Valid
|`$goodBye`|Valid
|`$hello_there`|Invalid, cannot contain underscore ( `_` ) |  
|`x`|Invalid, must start with `$` symbol

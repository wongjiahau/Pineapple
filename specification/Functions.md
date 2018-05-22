# Functions
Every function can be annotated with the `@function` keywords. This is optional, it is just to improve the readability.  
Note that the `??` operator means the function is unimplemented yet.

## How to call a function?
Just like how you will do it in Haskell. No need brackets, only space.  
Suppose we have this function `plus`.
```java
@function 
x:Number plus y:Number -> Number
    -> x + y

// Here's how you call the `plus` function
let result = 2 plus 5

```

## Prefix function
```java
@function 
sum xs:Number[] -> Number 
    if xs == [] -> 0
    else -> xs.1 + sum xs.(2..)

let result = sum [1,2,3,4]
```

## Suffix function
```ts
@function
howMany:Int daysFromToday -> Date 
    -> (today.days + howMany) as Date

let result = 5 daysFromToday
```


## Infix function
```ts
@function
x:Int plus y:Int -> Int
    -> x + y
```

## Mixfix funtion
```ts
@function
expect (x:Number) toEqual (y:Number) -> Void 
    -> ?? 

expect 99 toEqual 88 
```

## Function precedence
There is not function precedence, everything function is executed from left to right.

For example,
```js
display 5 asString // Invalid, `5` is not `String`

display (5 asString) // Valid
```

## Optional parameters
You can set a function to have optional parameters.

Let's look at the `_to_by` function.
```java
@function
(start:Int) to (end:Int) by (step:Int=1) -> Int[]
    if start >= end -> [end]
    -> [start] ++ ((start + step) to end by step)
    
// Calling it
let range1 = 0 to 6
print range1 // [0,1,2,3,4,5,6]

let range2 = 0 to 7 by 2
print range2 // [0,2,4,6]

```

## Referential transparency
Every function in `Pineapple`: 
- is not allowed to modify their input.   
- is not allowed to access variable that is out of scope
- must return a value
- cannot perform I/O operation unless annotated

This is because such function will enhance debuggability and chainability.


## How to declare a function that will perform IO operation?
By using the `iofunction` annotation.
```java
@iofunction
send (query:String) ToDatabase -> Void
    // Send query to database
    -> ??

```
Moreover, if your function is calling an `iofunction`, it needs to be annotated as `iofunction` too.

For example:
```java
@function 
sayHello -> Void
    print "hello" // Error, cannot call an iofunction inside a normal function

@iofunction 
sayBye -> Void
    print "bye" // No error
```

## Optional parameters
You can have optional parameters in functions.
For example,
```java
@iofunction
sayHi howMany:Int=1 times -> Void
    repeat howMany times
        print "hi"

// Calling with default parameter value
sayHi

// Calling with different value
sayHi 5 times
```


## How to pass data by reference?
You cannot pass data by reference.

## Void functions
Function that does not return anything must be declared with `-> Void`
```java
@iofunction 
sayHello -> Void
    print "Hello"
```

## What is the type of a function?
The type of a function will be like the following.
```java
@function 
(x:Number) square -> Number -> x * x

_square.type // Number -> Number

@function 
(x:Number) add (y:Number) -> x + y

_add_.type // (Number,Number) -> Number
```

## How to pass a function to a function?
Just like how you will import them from other file, using the `underscore` notation.  
For example, suppose we have the `map` function defined as above.
```java
@function 
(x: Number) add (y: Number) -> Number
    -> x + y

// This is how you pass the `add` function to `map`
let result = map _add_ to [[1,2], [3,4]]

print result // [3,7]

```
## Anonymous function
### Assigning a function to a variable
The variable name for function must contain 1 underscore if it contains 1 argument;   
2 underscore for 2 arguments, so on and so forth.  

The underscore determine where the argument should be placed.

If it contains no argument, no underscore is needed.

Note that you cannot have consecutive underscore.
```ts
let even_ = (x:Number) -> x % 2 == 0

// Here's how to call even_
even 5

let _add_ = (x:Number, y:Number) -> x + y

// How to call _add_
5 add 3

```
## Declaring function that takes function as parameter
### Single parameter 
```java
@function
invoke (func_:Number->Number) with (param:Number) -> Number
    func_ param
```

### Double parameter 
```java
@function
invoke (_func_:(Number,Number)->Number) on (list:Number[]) -> Number
    let result <- 0
    for i in 0 to (list.length - 2)
        result <- result + (list[i] _func_ list[i+1])
    -> result
```


## Currying
```java
@function
(x:Number) moreThan (y:Number) -> boolean
    -> x > y

let moreThanThree = _moreThan 3

// invert it
let threeMoreThan = 3 moreThan_

select moreThanThree from [1,2,3,4,5] // [4,5]

select threeMoreThan from [1,2,3,4,5] // [1,2,3]
```


## Calling a Bool function
When we call a Bool function, we must use the `is` or `not` keyword.

For example, let say we have a `empty` function to detect whether a list is empty or not.

```js
@function
empty xs:T[] -> Bool
    -> xs.length is == 0
```
Then, this is how to call it
```js
let result = [] is empty // valid
let result = [] not empty // valid

let result = empty [] // invalid
```
The purpose of this design is to enhance readability.

## Pattern matching (Pending)
*This feature is still under consideration, as it seems to violate the objective of Pineapple.*
```hs
@function
(x:Number) divide (y:Number) -> Number
x divide y -> x / y
_ divide 0 -> error


@function 
select (mapFunc: T -> T) whichIs (filterFunc: T -> Bool) from (list: T[]) -> T[]
select _ whichIs _ from [] = []
select mapFunc whichIs filterFunc from (x cons xs) -> 
    (mapFunc x) cons remaining
    if (filterFunc x) 
    else remaining
    where remaining = (select mapFunc whichIs filterFunc from xs)
```
Usage
```java
moreThan (x:Number) -> (y:Number) -> y > x
result = select num whichIs (moreThan 3) from [1,2,3,4]
//Little note: num will be expanded to (num -> num)
```
*To be honest, not many people can understand pattern matching and object deconstruction. LOL*

Let's look at the imperative version.
```java
@function
select (mapFunc: T -> T) whichIs (filterFunc: T -> Bool) from (list: T[]) -> T[]
    if list is empty_ -> []
    result = mutable []
    foreach x in list
        if filterFunc x
            add (mapFunc x) into result
    -> result
```
To be honest, the imperative version is actually much shorter can much cleaner than the functional counterpart. OOPS.

# Functions
Every function can be annotated with the `function` keywords. This is optional, it is just to improve the readability.  
Note that the `??` operator means the function is unimplemented yet.

## Some note
All function name must be in `camelCase`. 

## How to call a function?
Just like how you will do it in Haskell. No need brackets, only **space**.  
Suppose we have this function `plus`.
```
@function 
($x as Number) plus ($y as Number) >> Number
    return $x + $y

// Here's how you call the `plus` function
let $result = 2 plus 5
```

## Nofix function
Also means function without parameters.
```js
@function 
pi >> Number
    return 3.141592653

let $x = pi
```

## Prefix function
```js
@function 
sum ($xs as Number[]) >> Number 
    if $xs == []
        return 0
    else 
        return $xs.{1} + (sum $xs.{2..})

let $result = sum [1,2,3,4]
```

## Suffix function
```
function
($howMany as Int) daysFromToday >> Date 
    >> ((today).days + $howMany) as Date

let $result = 5 daysFromToday
```
Note that the space after `5` is necessary.  

## Infix function
```
@function
($x as Int) plus ($y as Int) >> Int
    >> $x + $y

let $result = 2 plus 5 plus 7
```

## Mixfix funtion
For example, you want a function that will split a string by a separator.
```
@function
split ($x as String) by ($delimiter as String) >> String[]
    >> ?? 

let $myString = `one/two/three`
let $separator = `/`
let $result = split $myString by $separator
```
**NOTE**: Every mixfix function must start with a prefix identifier, so the following is consider invalid.
```
// Invalid
@function
($start as Int) to ($end as Int) by ($step as Int) >> Int[]
    return ?
```
To fix that, you can add an identifier in front:
```
// Valid
@function
range ($start as Int) to ($end as Int) by ($step as Int) >> Int[]
    >> ?
```

## Symbolic infix function
You can also use symbols as signature for infix function.   
For exampe, let say you want to declare a function that adds two arrays: 
```
@function
($x as Number[]) + ($y as Number[]) >> Number[]
    makesure $left.length == $right.length
    let $result << []
    for $i in range 1 to $y.length
        $result << $result ++ [$x.{i} + $y.{i}]
    return $result
```
In fact, you can use any symbols combination except the following symbols:
- period/dot (`.`)
- comma (`,`)
- alias (`@`)
- colon (`:`)
- backtick (\`)
- question mark(`?`)
- double less than (`<<`)
- double more than (`>>`)
- equal (`=`)
- pipe (`|`)
- ampersand (`&`)
- any brackets (`[](){}`)
- whitespace

For example, the following are valid symbols:
- `==>`
- `^%`
- `+`

## Function precedence
There is not function precedence, everything function is executed from left to right.

For example,
```js
display 5 asString // Invalid, `5` is not `String`

display (5 asString) // Valid
```

## Optional parameters
You can set a function to have optional parameters.

Let's look at the `range_to_by_` function.
```
function
range ($start as Int) to ($end as Int) step ($step as Int = 1) >> Int[]
    if $start is >= $end 
        return [$end]
    else
        return [$start] ++ (($start + $step) to $end by $step)
    
// Calling it
let $range1 = range 0 to 6
print $range1 // [0,1,2,3,4,5,6]

let $range2 = range 0 to 7 by 2
print $range2 // [0,2,4,6]
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
```
iofunction
send ($query as String) toDatabase >> Void
    // Send query to database
```
Moreover, if your function is calling an `iofunction`, it needs to be annotated as `iofunction` too.

For example:
```js
function 
sayHello >> Void
    print `hello` // Error, cannot call an iofunction inside a normal function

iofunction 
sayBye >> Void
    print `bye` // No error
```

## Optional parameters
You can have optional parameters in functions.
For example,
```js
iofunction
sayHi $howMany:Int=1 times >> Void
    makesure $howMany is > 0
    for $i in range 1 to $howMany
        print `hi`

// Calling with default parameter value
sayHi

// Calling with different value
sayHi 5 times
```

## Function overloading (Polymorphism)
Pineapple allow function with same signature to overload with different parameter type.
For example, the following function declaration are valid.
```
@function
($x as Int) add ($y as Int) >> Int
    return $x + $y

@function
($xs as Int[]) add ($ys as Int[]) >> Int[]
    return zip [$xs, $ys] with (+)
```
However, when you are overloading function with subtypes, the compiler will **resolve to the more specific type whenever possible**.

For example, let say we have two `plus` functions.
```java
// First function
@function
($x as Int) plus ($y as Int) >> Int
    return $x + $y

// Second function
@function
($x as Number) plus ($y as Number) >> Number
    return $x + $y

1   plus 2     // Resolve to first function
1.1 plus 2.2 // Resolve to second function
1.1 plus 2   // Resolve to second function
1   plus 2.2   // Resolve to second function
```


## How to pass data by reference?
**You cannot pass data by reference.**  
This is to ensure that every function is pure, so that the program will be easier to debug.

## Void functions
Function that does not return anything must be declared with `>> Void`
```js
iofunction 
sayHello >> Void
    print `Hello`
```

## What is the type of a function?
The type of a function will be like the following.
```java
function 
x@Number :square >> Number 
    >> x * x

(square:).type // Number >> Number

function 
x:Number :add: y:Number >> Number
    x + y

(:add:).type // (Number,Number) >> Number
```

## How to pass a function to a function?
For example, suppose we have the `map` function defined as above.
```java
function 
x:Number :add: y:Number >> Number
    >> x + y

// This is how you pass the `add` function to `map`
let result = map: (:add: 2) :to: [1,2,3,4]

print: result // [3,4,5,6]

```
## Anonymous function (pending)
### Assigning a function to a variable 
Note that `$1` means the first parameter and `$2` means the second paramter.
```ts
let %even = $1 % 2 is == 0 

let %add = $1 + $2


// Here's how to invoke %even
let result = 5 is %even 

// Here's how to invoke %add
3 %add 5

// How to call _add_
5 add 3
```

## Declaring function that takes function as parameter
### Single parameter 
```js
function
invoke %func:(Number >> Number) with $param:Number >> Number
    %func $param
```

### Double parameter 
```java
@function
invoke $_func_:(Number>>Number>>Number) on $list:Number[] >> Number
    let $result << 0
    for $i in range 1 to $list.length
        $result << $result + ($list.{i} func $list.{i+1})
    >> $result
```


## Currying
```js
function
$x:Number moreThan $y:Number >> Boolean
    >> $x > $y

let $moreThanThree = _ moreThan 3

// invert it
let $threeMoreThan = 3 moreThan _

select $moreThanThree from [1,2,3,4,5] // [4,5]

select $threeMoreThan from [1,2,3,4,5] // [1,2,3]
```

## Pattern matching (Pending)
*This feature is still under consideration, as it seems to violate the objective of Pineapple.*
```hs
@function
(x:Number) divide (y:Number) >> Number
x divide y >> x / y
_ divide 0 >> error


@function 
select (mapFunc: T >> T) whichIs (filterFunc: T >> Boolean) from (list: T[]) >> T[]
select _ whichIs _ from [] = []
select mapFunc whichIs filterFunc from (x cons xs) >> 
    (mapFunc x) cons remaining
    if (filterFunc x) 
    else remaining
    where remaining = (select mapFunc whichIs filterFunc from xs)
```
Usage
```java
moreThan (x:Number) >> (y:Number) >> y > x
result = select num whichIs (moreThan 3) from [1,2,3,4]
//Little note: num will be expanded to (num >> num)
```
*To be honest, not many people can understand pattern matching and object deconstruction. LOL*

Let's look at the imperative version.
```java
@function
select (mapFunc:T>>T) whichIs (filterFunc:T>>Boolean) from (list:T[]) >> T[]
    if list is empty 
        >> []
    let result = mutable []
    for x in list
        if filterFunc x
            result << result ++ mapFunc x
    >> result
```
To be honest, the imperative version is actually much shorter can much cleaner than the functional counterpart. OOPS.

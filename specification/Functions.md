# Functions
Every function can be annotated with the `@function` keywords. This is optional, it is just to improve the readability.  
Note that the `??` operator means the function is unimplemented yet.

## How to call a function?
Just like how you will do it in Haskell. No need brackets, only space.  
Suppose we have this function `plus`.
```java
@function 
(x:number) plus (y:number) => number
    => x + y

// Here's how you call the `plus` function
result = 2 plus 5

```

## Prefix function
```java
@function 
sum (xs:number[]) => number 
    => ??

result = sum [1,2,3,4]
```

## Suffix function
```ts
@function
(howMany:int) daysFromToday => Date 
    => ??

result = 5 daysFromToday
```
```js
result = daysFromToday(5);
```

## Infix function
```ts
@function
(x:boolean) xor (y:boolean) => number
    => ??

result = true xor false

```
## Hybrid funtion
```ts
@function
expect (x:number) toEqual (y:number) =>  maybe error 
    => ?? 

assert 99 Equal 88 // error
```

```ts
@function
from (list: T[])
    select (function: T => T)
    where (comparator: T => boolean) => T[]
    => ??

from [1,2,3,4]
    select (x => x + 2)
    where (x => x > 4) 
// The result will be []
```

## Function precedence
```
Prefix > Suffix > Infix > Hybrid
```

## Referential transparency
By default, all function in Pineapple is clean, which means it won't modify the input and no I/O operation is allow. 

Therefore, all function parameters are **passed by value**.   

However, if a function need to use I/O function or modify the parameter, it will need to be declared as *dirty*.  

When a function is declared as **dirty**, its parameter will be **passed by reference** no matter how primitive is the data type.

All `dirty` functions can only be called using arrow operator.
This is to allow the programmer to quickly identified which lines contain side effects.

Operators:  
- `<-` is used for getting result from a `dirty` function
- `->` is used for calling void function

```ts
name <- readLine
-> print "Hello"

name = readLine // Compiler error
print "Hey" // Compiler error
```

## How to declare a dirty function?
By using the `dirtyFunction` annotation.
```java
@dirtyFunction
send (query: string) ToDatabase => void
    // Send query to database
    => ??

```


## How to limit a dirtyFunction?
Sometimes we might pass an object to a function, but we only want it to manipulate some of the properties.  
To achieve this, you can use the `can-only-change` operator.  
For example:
```java
@type
Fruit:
    .name  : string
    .price : number

@dirtyFunction
modifyPrice (fruit: Fruit) => void
    can-only-change .name
    fruit.name = "new fruit"
    fruit.price = 123  // Error: Cannot modify `.price`
```


If a function is not annotated with `dirtyFunction`, it cannot contain statement that call another `dirtyFunction`.  

For example:
```java
@function 
sayHello => null
    -> print "hello" // Error, cannot call a dirty function inside a normal function
```

The dirty keyword annotation is purposely made to be hard to type because programmer is discouraged from using `dirtyFunction`. Consequently, the code base will be much more easier to test and maintain due to the cleanliness.

## How to pass data by reference?
Same. By using the `dirtyFunction` annotation. However, only variable declared with `var` can be passed to this kind of function.
For example:
```java
@dirtyFunction
add (value: number) to (target: number) => void
    target += value

var x = 5
-> add 10 to x
-> print x toString // 15

y = 7
-> add 99 to y // Error, cannot pass constant `y` to a dirtyFunction


```

## Void functions

Function that does not return anything must be declared with `=> void`

```java
@dirtyFunction 
sayHello => void
    -> print "Hello"
```


## How to declare a function that will take in function?
It will looks similar like Typescript.  
For example, let's look at how to define a simple `map` function in Pineapple.
```java
@function
map (func: (x: number, y: number) => number) to (xys: number[][]) => number[]
    var result = []
    foreach xy in xys
        add func(xy[0], xy[1]) to result
    => result
```

## How to pass a function to a function?
Just like how you will import them from other file, using the `underscore` notation.  
For example, suppose we have the `map` function defined as above.
```java
@function 
(x: number) add (y: number) => number
    => x + y

// This is how you pass the `add` function to `map

result = map _add_ to [[1,2], [3,4]]

-> print result // [3,7]

```
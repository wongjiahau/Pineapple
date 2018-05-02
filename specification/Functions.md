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
```ts
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

expect 99 toEqual 88 
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
To achieve this, you can use the `changing` operator.  
For example:
```java
@type
Fruit:
    .name  : string
    .price : number

@dirtyFunction
modifyPrice (fruit: Fruit) => void
    changing fruit.name
    fruit.name <- "new fruit"
    fruit.price <- 123  // Error: Cannot modify `.price`
```


If a function is not annotated with `dirtyFunction`, it cannot contain statement that call another `dirtyFunction`.  

For example:
```java
@function 
sayHello => void
    print "hello" // Error, cannot call a dirty function inside a normal function
```

The dirty keyword annotation is purposely made to be hard to type because programmer is discouraged from using `dirtyFunction`. Consequently, the code base will be much more easier to test and maintain due to the cleanliness.

## How to pass data by reference?
Same. By using the `dirtyFunction` annotation. 

For example:
```java
@dirtyFunction
add (value: number) to (target: number) => void
    target += value

x <- 5
add 10 to x
print x // 15

y = 7
add 99 to y // Error: `y` is already binded to value `7`
```

## Void functions
Function that does not return anything must be declared with `=> void`

```java
@dirtyFunction 
sayHello => void
    print "Hello"
```

## What is the type of a function?
The type of a function will be like the following.
```java
@function 
(x:number) square => x * x

type-of _square // number => number

@function 
(x:number) add (y:number) => x + y

type-of _add_ // number => number => number
```
They are just like function in Haskell.  


## How to declare a function that will take in function?
It will looks similar like Typescript.  
For example, let's look at how to define a simple `map` function in Pineapple.
```java
@function
map (func: number => number => number) to (xys: number[][]) => number[]
    result <- []
    foreach xy in xys
        result <- result eat (func xy[0] xy[1])
    => result
```

## How to pass a function to a function?
Just like how you will import them from other file, using the `underscore` notation.  
For example, suppose we have the `map` function defined as above.
```java
@function 
(x: number) add (y: number) => number
    => x + y

// This is how you pass the `add` function to `map`
result = map _add_ to [[1,2], [3,4]]

print result // [3,7]

```


## Anonymous function
Anonymous function are always called by prefix notation, for example, let say we have a function that call another function
### Single parameter 
```java
@function
invoke (func: number => number) with (param: number) => number
    func param
```
### Double parameter 
```java
@function
invoke (func: number => number => number) on (list: number[]) => number
    result <- 0
    foreach i in 0 to (list.length - 2)
        result <- result + func list[i] list[i+1]
    => result
```


## Currying
There are 2 ways, the first one which is the usual one (as in Haskell or Javascript)
```java
@function
moreThan (x:number) => (y:number) => y > x

moreThanThree = morethan 3
5 moreThenThree // true
```
However, that way of currying is not really readable, and you can't swap the parameter position easily.  
Now, let's see the Pineapple way of currying.
```java
@function
(x:number) moreThan (y:number) => x > y

moreThanThree = _moreThan 3

// invert it
threeMoreThan = 3 moreThan_

result1 = select moreThanThree from [1,2,3,4,5] // [4,5]

result2 = select threeMoreThan from [1,2,3,4,5] // [1,2,3]
```


## Tips
When we declare a boolean function, don't start it with the *is* word.
```java
@function
(list: T[]) isEmpty => boolean  // bad
(list: T[]) empty   => boolean  // good
```

Why? Because we can declare an `is` and `isnt` function.
```java
@function 
(item:T) is (func: T => boolean) => func item
@function
(item:T) isnt (func: T => boolean) => not (func item)
```
Then we can use it like this:
```java
[] is empty // true
[1,2,3] isnt empty // true
```
Of course, you can also call it without the `is` function, but it is not recommended as it seems unnatural.
```java
[] empty // true
not [1,2,3,4] empty // false
```

## Pattern matching (Pending)
*This feature is still under consideration, as it seems to violate the objective of Pineapple.*
```hs
@function
(x:number) divide (y:number) => number
x divide y => x / y
_ divide 0 => error


@function 
select (mapFunc: T => T) whichIs (filterFunc: T => boolean) from (list: T[]) => T[]
select _ whichIs _ from [] = []
select mapFunc whichIs filterFunc from (x cons xs) => 
    (mapFunc x) cons remaining
    if (filterFunc x) 
    else remaining
    where remaining = (select mapFunc whichIs filterFunc from xs)
```
Usage
```java
moreThan (x:number) => (y:number) => y > x
result = select num whichIs (moreThan 3) from [1,2,3,4]
//Little note: num will be expanded to (num => num)
```
*To be honest, not many people can understand pattern matching and object deconstruction. LOL*

Let's look at the imperative version.
```java
@function
select (mapFunc: T => T) whichIs (filterFunc: T => boolean) from (list: T[]) => T[]
    if list is empty => []
    result = mutable []
    foreach x in list
        if filterFunc x
            add (mapFunc x) into result
    => result
```
To be honest, the imperative version is actually much shorter can much cleaner than the functional counterpart. OOPS.

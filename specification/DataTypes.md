# Data types

|Type|Example|  
|--|--|  
|`Number`|-9, 23, 77.77|
|`Int`|-2, -1, 0, 1, 2|
|`String`|`"hello"`, `'hey'`, `$"yoyo"`|
|`Regex`|`/^[a-z]$/`|
|`Directory`|`./index.html` , `../folder`|
|`Boolean`|`true`, `false`|
|`List`|`[1,2,3]`, `["p", "i", "n", "e"]`|
|`Object`|`{.name='hi' .age=9}`|
|`Any`|any data type|
|`Null`|`null`|
|`Type`|`12.type`|
|`Member`|`member-of People`|
|`Function`|`($:Number) -> Number`|
|`Error`|No examples yet|


## How to declare my own data type?
By using the `@type` annotation.
```java
// Definition
@type 
Fruit:
    .name    : String
    .isTasy  : Boolean
    .sibling : Fruit | null
```

## Types with default value
Sometimes, you will need to have default value for a type in order to reduce boilerplate.  
For example:
```java
@type
Fruit:
    .name    : String
    .isTasy  : Boolean
    .sibling : Fruit | null = null
```
So, the default value for `.sibling` is `null`.

Now, whenever you initialize a `Fruit`, you don't need to specify the `.sibling` property.
```js
// The following code is valid
let myFruit:Fruit = 
    .name = `Pineapple`
    .isTasty = true
```

## Type safety
If you declare a variable to have a specific type, Pineapple compiler will expect the variable fully fulfils the specification of the type.
```js
let myFruit: Fruit = 
    .name = 123 // Error, `.name` should be type of `String`
    .isTasty = true
    // Error, missing member `.sibling`
```


## Null-safe
By default, a variable cannot be set to `null`.  
Pineapple used this approach to prevent a very common error like `null pointer`.
```coffee
let x: String <- "hello"
x <- null # Compiler error
```


## Discriminated unions
You can have a variable which can have both type. For example, you might want to have a nullable String type.
```java
let x: String | null <- "hello"
x <- null // No error


@type 
Color: "red" | "green" | "blue"

let myColor: Color = "yellow" // Error
```

## Type intersections
You can specify a type to implement more than 1 interface using the `&` operator.  
For example, let say we have the following interfaces.
```java
@interface
Stringifiable:
    target:T asString -> String

@interface 
Addable:
    x:T (+) y:T -> T
```
Then, we have a type which will implement both the interfaces.
```js
@type
Fruit implements Stringifiable & Addable:
    .name:String
    .price:Number

target:Fruit asString -> String
    -> `Name: ${target.name}, Price: ${target.price}`

x:Fruit (+) y:Fruit -> Fruit
    -> 
        .name  = x.name ++ y.name
        .price = x.price + y.prce
```
Now, you can have a function that take the types of `Stringifiable & Addable`.
```java
@iofunction
show target:(Stringifiable & Addable) -> Void
    target asString
    >> print _
```

## Enumerations
Enumaration can be declared using `@enum` annotation.

```java
@enum
Color = 
    #Red
    #Green 
    #Blue

let myColor = Color#Red
```

## Generics
Generics can be done using the `T` keyword.
```java
@function
quicksort xs:T[] -> T[] where T:Comparable
    if xs == [] -> []
    let pivot = xs.(1)
    let left  = for x in xs take x if x < pivot
    let right = for x in xs take x if x > pivot
    -> (quicksort left) ++ [pivot] ++ (quicksort right)
```

## How to get the type of a thing?
By using the `.type` member. 
```java
x = 5

x.type // Number

x.type.type // Type

```

## Safe cast
You can use the `!:` operator to ensure the data assigned to a variable has the correct type, else runtime error will be thrown.

This feature is important especially you are dealing with data from the outside world.  
Consider the following example for processing an API request.

```ts
@type Fruit
    .name  : String
    .price : Number

let result !: Fruit = 
    await request "https://www.pineapple.com/api/fruits"
    >> parseJSON _
```
You can read `!:` as `must-be-a`.  So, in this case, `result` must be a `Fruit`, if not error would be thrown at runtime.


## What is the use of `member` type?
It is useful when your function needs to take the `member` of a type.  
This will allow you to create some very powerful function that can emulate another language, for example `SQL`.  
Let's look at the example below to understand more.

```java
@type
People:
    .name : String
    .age  : Number

@function
select (M: member of T) from (list: T[]) -> type of M
    where T: People
    let result: T[] = []
    for item in list
        result <- result ++ [item.(M)]
    -> result

let peopleList :People[] = [
    {.name='John' .age=12},
    {.name='Lee'  .age=99}
]

// Then you can call the function like this
let names = select .name from peopleList // ['John', 'Lee']
let ages  = select .age from peopleList  // [22, 99]
let gfs   = select .girlFriend from peopleList  // Error: `.girlFriend` is not a member of `People`
```
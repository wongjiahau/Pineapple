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
|`Type`|`type-of number`|
|`Member`|`member-of People`|
|`Function`|`($:number) => number`|


## How to declare my own data type?
By using the `@type` annotation.
```java
// Definition
@type 
Fruit:
    .name    : string
    .isTasy  : boolean
    .sibling : Fruit | null
```

## Type safety
If you declare a variable to have a specific type, Pineapple compiler will expect the variable fully fulfils the specification of the type.
```js
let myFruit: Fruit = 
    .name = 123 // Error, `.name` should be type of `string`
    .isTasty = true
    // Error, missing member `.sibling`
```


## Null-safe
By default, a variable cannot be set to `null`.  
Pineapple used this approach to prevent a very common error like `null pointer`.
```coffee
let x: string <- "hello"
x <- null # Compiler error
```

## Enumerations
Enumaration can be declared using `@enum` annotation.
```java
@enum
Color: Red | Green | Blue

myColor = Color.Red
```

## Discriminated unions
You can have a variable which can have both type. For example, you might want to have a nullable string type.
```java
let x: string | null <- "hello"
x <- null // No error


@type 
Color: "red" | "green" | "blue"

let myColor: Color = "yellow" // Error
```


## Generics
Generics can be done using the `T` keyword.
```java
@function
quicksort xs:T[] -> T[] where T:Comparable
    if xs == [] -> xs
    let pivot = xs.(0)
    let left  = for x in xs take x if x < pivot
    let right = for x in xs take x if x > pivot
    -> quicksort left ++ [pivot] ++ quicksort right
```

## How to get the type of a thing?
By using the `.type` member. 
```java
x = 5

x.type // number

x.type.type // type

```

## What is the use of `member` type?
It is useful when your function needs to take the `member` of a type.  
This will allow you to create some very powerful function that can emulate another language, for example `SQL`.  
Let's look at the example below to understand more.

```java
@type
People:
    .name : string
    .age  : number

@function
select (M: member of T) from (list: T[]) => type of M
    where T: People
    var result: T[] = []
    foreach item in list
        add item[M] to result
    => result

let peopleList :People[] = [
    {.name='John' .age=12},
    {.name='Lee'  .age=99}
]

// Then you can call the function like this
let names = select .name from peopleList // ['John', 'Lee']
let ages  = select .age from peopleList  // [22, 99]
let gfs   = select .girlFriend from peopleList  // Error: `.girlFriend` is not a member of `People`
```
# Data types

|Type|Example|  
|--|--|  
|`number`|-9, 23, 77.77|
|`int`|-2, -1, 0, 1, 2|
|`string`|`"hello"`, `'hey'`, `$"yoyo"`|
|`regex`|`/^[a-z]$/`|
|`boolean`|`"true"`, `false`|
|`list`|`[1,2,3]`, `["p", "i", "n", "e"]`|
|`object`|`{.name='hi' .age=9}`|
|`any`|any data type|
|`null`|`null`|
|`type`|`type-of number`|
|`member`|`member-of People`|
|`function`|`($:number) => number`|


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
myFruit: Fruit = 
    .name = 123 // Error, `.name` should be type of `string`
    .isTasty = true
    // Error, missing member `.sibling`
```


## Null-safe
By default, a variable cannot be set to `null`.  
Pineapple used this approach to prevent a very common error like `null pointer`.
```coffee
var x: string = "hello"
x = null # Compiler error
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
var x: string | null = "hello"
x = null // No error


@type 
Color: "red" | "green" | "blue"

myColor: Color = "yellow" // Error
```


## Generics
Generics can be done using the `T` keyword.
```java
@function
sort (list: T[]) => T[]
    where T: IComparable
    => ??
```

## How to get the type of an thing?
By using the `type-of` function. 
```java
x = 5
type-of x // number

type-of number // type

type-of type // type
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
select (M: member-of T) from (list: T[]) => type-of M
    where T: People
    var result: T[] = []
    foreach item in list
        add item[M] to result
    => result

peopleList: People[] = [
    {.name='John' .age=12},
    {.name='Lee'  .age=99}
]

// Then you can call the function like this
names = select .name from peopleList // ['John', 'Lee']
ages  = select .age from peopleList  // [22, 99]
gfs   = select .girlFriend from peopleList  // Error: `.girlFriend` is not a member of `People`
```
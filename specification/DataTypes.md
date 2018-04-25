# Data types

|Type|Example|  
|--|--|  
|`number`|-9, 23, 77.77|
|`int`|-2, -1, 0, 1, 2|
|`string`|`"hello"`, `'hey'`, `$"yoyo"`|
|`regex`|`/^[a-z]$/`|
|`boolean`|`"true"`, `false`|
|`list`|`[1,2,3]`, `["p", "i", "n", "e"]`|
|`object`|`(.name="hi" .age=9)`|
|`any`|any data type|
|`null`|`null`|
|`type`|`typeOf number`|

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
By using the `typeOf` function. 
```js
x = 5
typeOf x // number

typeOf number // type

typeOf type // type
```
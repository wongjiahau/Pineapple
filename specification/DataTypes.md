# Data types
## How to declare my own blueprint?
By using the `@blueprint` annotation.
```ts
// Definition
@blueprint
Fruit 
    .name    : String 
    .isTasty : Boolean
    .sibling : Fruit?

```

## How to create a subtype of a type?
By using the `reducing` keyword.  
For example, let say we want to create a `Month` type. 
```js
@type 
Month reducing Integer 
    where $self is >= 0 and is <= 31 
```
Or, let say phone number.
```js
@type 
PhoneNumber reducing String 
    where $self is matching /^[0-9]{10}$/
```
Then, when we initialized a value with those type, the compiler will check if it satisfy the defined condition.
```ts
let $adamsPhone : PhoneNumber = `abc` 
// Error: Doesn't match condition of `is matching /^[0-9]{10}$/`
```
You can also do casting with it.
```ts
let $myPhone = `012345678` as! PhoneNumber
print $myPhone.type // PhoneNumber
```

## How to create a derived blueprint?
You can do that by using the `extend` keyword.  
For example,
```ts
// Define a blueprint of Human, which has a `name` property
@blueprint 
Human
    .name : String

// Create a blueprint of Worker, which extend from the Human blueprint
@blueprint 
Worker extend Human
    .salary : Decimal

let $me : Human =
    .name = `Adam`

let $him : Worker = 
    .name   = `John`
    .salary = 999.99
```

## Types with default value (pending)
Sometimes, you will need to have default value for a type in order to reduce boilerplate.  
For example:
```ts
type Fruit
    .name    : String
    .isTasty : Boolean
    .sibling : mutable (Fruit|nil) << nil
```
So, the default value for `.sibling` is `nil`.

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
let $myFruit:Fruit = 
    .name = 123 // Error: `.name` should be type of `String`
    .isTasty = true
    // Error: missing member `.sibling`
```


## Null-safe
By default, a variable cannot be set to `nil`.  
Pineapple used this approach to prevent a very common error like `nil pointer`.
```ts
let $x : String << "hello"
$x << nil // Compiler error
```

## Nullable types
To have a nilable type, you need to use the discrimanated union of nil.
```ts
let $y : mutable String << nil // Error: Cannot assign `nil` to `String`

let $x : mutable (String|nil) << nil // No error
```

## Discriminated unions
You can have a variable which can have both type. 
```ts
let $x : mutable (String|Int) << `hello`
$x << 4 // No error
```

## Type intersections
You can specify a type to implement more than 1 interface using the `&` operator.  
For example, let say we have the following interfaces.
```ts
@behavior 
Stringifiable<T>
    $target:T asString >> String

@behavior
Addable
    $x:T (+) $y:T >> T
```
Then, we have a type which will implement both the interfaces.
```java
@blueprint 
Fruit realize (Stringifiable & Addable)
    .name  : String
    .price : Number

@function 
$target:Fruit asString >> String
    return `Name: $target.name, Price: $target.price`

@function 
$x:Fruit (+) $y:Fruit >> Fruit
    return 
        .name  = $x.name ++ $y.name
        .price = $x.price + $y.price
```
Now, you can have a function that take the types of `Stringifiable & Addable`.
```
@iofunction
show $target:(Stringifiable & Addable) >> Void
    print ($target asString)
```

## Special nil type
`nil` is a trinity:
    - it is a function
    - it is a data type
    - it is a literal value

## Enumerations (Pending)
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
```
function
quicksort $xs:T[] >> T[] where T:Comparable
    if $xs == [] 
        >> []
    else
        let $pivot = xs.{1}
        let [$left, $right] = partition $xs by (_ > $pivot)
        >> (quicksort $left) ++ [$pivot] ++ (quicksort $right)
```

## How to get the type of a thing?
By using the `.type` member. 
```java
let $x = 5

$x.type // Number

$x.type.type // Type
```

## Type casting
To cast a type, you can use either `as!` or `as?` operator.

### The `as?` operator

When you use `as?`, if the value is uncastable to the desired type, `nil` will be returned.

For example,

```js
let $myNumber = 5
let $casted = $myNumber as? String
print $casted // nil
```
Casted is `nil` because the compiler cannot cast `Number` to `String`.

---
### The `as!` operator

When you use `as!`, if the value is uncastable to the desired type, an error will be thrown.

This feature is important especially you are dealing with data from the outside world.  

Consider the following example for processing an API request.

```ts
@blueprint 
Fruit
    .name  : String
    .price : Number

let $result = 
    await request `https://www.pineapple.com/api/fruits`
    |> parseJSON _
    |> _ as! Fruit
```
The `as!` operator allows the program to fail fast if the API is not returning the correct type, so the debug time will be reduced.


## What is the use of `member` type? (PENDING)
It is useful when your function needs to take the `member` of a type.  
This will allow you to create some very powerful function that can emulate another language, for example `SQL`.  
Let's look at the example below to understand more.

```
type People
    .name @ String
    .age  @ Number

function
select (M @ member of T) from (list @ T[]) >> type of M where T@People
    let result: T[] = []
    for item in list
        result << result ++ [item.(M)]
    >> result

let peopleList :People[] = [
    {.name='John' .age=12},
    {.name='Lee'  .age=99}
]

// Then you can call the function like this
let names = select .name from peopleList // ['John', 'Lee']
let ages  = select .age from peopleList  // [22, 99]
let gfs   = select .girlFriend from peopleList  // Error: `.girlFriend` is not a member of `People`
```
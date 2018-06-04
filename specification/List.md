# Lists
List in Pineapple are just like list in Python. However, they must consist of the same type, no list with mixed typed is allowed.

## Initialization
```js
let xs = [1,2,3,4]

let invalidList = [1, "b"] // Error: Cannot contain different type in a list

let manyFruits = [
    #(.name="Apple"     .color="red"),
    #(.name="Pineapple" .color="yellow")
]


```

## Indexing
Indexing is done using the dot-bracket (`.{}`) operator.
The first element will have the index of **ONE**.
```ts
let xs = [11,22,33,44]

// Get first element
xs.{1} // 11

// Get last element
xs.{-1} // 44

// Get the second last element
xs.{-2} // 33
```
### Design decision
#### Why we use one instead of zero in Pinapple? 
Because this aligns with one of the design goal of Pineapple, which is *What you see is what you get*.  If you see `xs.{1}`, it means the first element, you don't have to plus 1 in your head like you would do in other language such as C.


## Slicing
To slice a list, you can use the following operators:
- double-dot (`..`)
- double-dot-lessThan (`..<`)
```swift
xs = [10, 20, 30, 40]

// Get from first element to third element
xs.{1..3} // [10, 20, 30]

// Get from second element to 2nd last element
xs.{2..-2} // [20,30]

// Get from second element to before 3rd element
xs.{1..<3} // [10,20]

// Get until third element from start
xs.{..3} // [10,20,30]

// Get from second element till end
xs.{2..} // [20,30,40]
```

## List unpacking
You can unpack items of a list to variables.
```ts
let a, b, c = [1, 2, 3]
print a // 1
print b // 2
print c // 3
```

## How to have list of items with different type (aka Tuples)?
You need to declare the type explicitly. For example: 
```ts
let tuple1 = ["price", 99] // Error: Items in a list must be of the same type

let tuple2@[String,Number] = ["price", 99] // No error

let listOfTuples@[String, Number][] = [
    ["apple"    , 12],
    ["pineapple", 24],
    ["durian"   , 33]
] // No error
```
Note that you cannot concat a tuple.
```ts
let list1@[String, Number] = ["apple", 99]
let list2 = list1 ++ ["something else"] // Error
```
However, a tuple can be mutable.
```ts
let myTuple@[String,Number] = mutable ["price",12]
myTuple.{0} << "hey" // No error
myTuple.{1} << 99 // No error

myTuple.{0} << "123" // Error: Expected type of String, but got type of Number
```

## How to get range of Numbers?
You can do that by using the utility function `to`.
```ts
let x = 1 to 5 // [1,2,3,4,5]
let y = -2 to 2 // [-2,-1,0,1,2]
```
### Definition of `to`
```java
@function
start@Int :to: end@Int >> Int[]
    if start is == end >> [end]
    >> [start] ++ ((start - 1) :to: end)

```

## Mutability
By default, you cannot change the member of an list.  For example :
```ts
let xs = [1, 2, 3, 4]

// Change the last element to 99
xs.{-1} << 99 // Compile error
```
However, if you want to declare an list which is immutable, you need to use the `mutable` keyword.  
```ts
let xs = mutable [1,2,3,4]
xs.{-1} << 99 // No error
```

## Strings
Strings are actually list of characters, so you can apply list operation on `string` as well.
```ts
let message = "Pineapple"
message.{5..-1} // "apple"
```


## List comprehension (pending)
```ts
let fruits = ['apple', 'banana', 'pineapple']
let longNameFruits = for f in fruits take f if f.length > 5 
// ['banana', 'pineapple']

let xs = [1,2,3,4,5]
let newList = for x in xs take x*2 // [1,3,9,16,25]
```

## List concatenation 
You can concat 2 list using the double plus operator (`++`).
```ts
[1,2,3] ++ [99] ++ [4,5,6]  // [1,2,3,99,4,5,6]
"pine" ++ "apple" // "pineapple"
```

## Appending new item to list
Since Pineapple promote functional-style programming, there is no built-in function such as `push` or `append`.   
The recommended way is to use list concatenation.  
```js
let myList << [1,2,3]
myList << myList ++ [99]
print: myList // [1,2,3,99]


```

## List of objects
There are 2 ways to declare list of objects.  
The first way is the usual way with brackets.
```ts
let fruits = [
    {.name = "Pine" .price = 22},
    {.name = "Apple" .price = 33},
    {.name = "Durian" .price = 44}
]
```
The other way (as below) would be more accessible.

```ts
// List of object
let fruits = #
    .1 = #
        .name  = "Pine"
        .price = 22
    .2 = #
        .name  = "Apple"
        .price = 33
    .3 = #
        .name  = "Durian"
        .price = 44
```
How to access `"Pine"`?
```
fruits.{1}.name
```

# Lists
List in Pineapple are just like list in Python. However, they must consist of the same type, no list with mixed typed is allowed.

## Initialization
```js
let xs = [1,2,3,4]

let invalidList = [1, "b"] // Error: Cannot contain different type in a list

let manyFruits = [
    {.name="Apple"     .color="red"},
    {.name="Pineapple" .color="yellow"}
]


```

## Indexing
Indexing is done using the dot (`.`) or dot-bracket (`.()`) operator (same as OCaml).
The first element will have the index of **ONE**.
```ts
xs = [11,22,33,44]

// Get the first element without bracket
myList.1 // 11

// Get first element
mylist.(1) // 11

// Get last element
xs.(-1) // 44
```

## Slicing
To slice a list, you can use the following operators:
- double-dot (`..`)
- double-dot-lessThan (`..<`)
```swift
xs = [10, 20, 30, 40]

// Get from first element to third element
xs.(1..3) // [10, 20, 30]

// Get from second element to 2nd last element
xs.(2..-2) // [20,30]

// Get from second element to before 3rd element
xs.(1..<3) // [10,20]

// Get until third element from start
xs.(..3) // [10,20,30]

// Get from second element till end
xs.(2..) // [20,30,40]
```

## How to get range of Numbers?
You can do that by using the utility function `to`.
```python
x = 1 to 5 # [1,2,3,4,5]
y = -2 to 2 # [-2,-1,0,1,2]
```
### Definition of `to`
```java
@function
start:Int to end:Int -> Int[]
    if start == end -> [end]
    -> [start] ++ ((start - 1) to end)
```

## Mutability
By default, you cannot change the member of an list.  For example :
```python
xs = [1, 2, 3, 4]

# Change the last element to 99
xs.(-1) <- 99 # Compile error
```
However, if you want to declare an list which is immutable, you need to use the `mutable` keyword.  
```python
xs = mutable [1,2,3,4]
xs.(-1) <- 99 # No error
```

## Strings
Strings are actually list of characters, so you can apply list operation on `string` as well.
```python
message = 'Pineapple'
message.(5..-1) # 'apple'
```


## List comprehension
```python
fruits = ['apple', 'banana', 'pineapple']
longNameFruits = for fruit in fruits take fruit if fruit.length > 5 # ['banana', 'pineapple']

xs = [1,2,3,4,5]
newList = for x in xs take x*2 # [1,3,9,16,25]
```

## List concatenation 
You can concat 2 list using the double plus operator (`++`).
```python
[1,2,3] ++ [99] ++ [4,5,6]  # [1,2,3,99,4,5,6]
"pine" ++ "apple" # "pineapple"
```

## Appending new item to list
Since Pineapple promote functional-style programming, there is no built-in function such as `push` or `append`.   
The recommended way is to use concatenation.  
```js
let myList <- [1,2,3]
myList <- myList ++ [99]
print myList // [1,2,3,99]


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
let fruits = 
    .1 = 
        .name  = "Pine"
        .price = 22
    .2 = 
        .name  = "Apple"
        .price = 33
    .3 = 
        .name  = "Durian"
        .price = 44
```
How to access `"Pine"`?
```
fruits.1.name
```

# Classes
There no classes in Pineapple! However you can simulate that using suffix function.

## Example: BinaryTree
```ts
// Definition of BinaryTree
type 
BinaryTree{T extend Comparable}:
    .left  @ BinaryTree{T}? = nil
    .right @ BinaryTree{T}? = nil
    .value @ T

function
newTree: value@T >> BinaryTree{T}
    >> #
        .left  << nil
        .right << nil
        .value =  value
// Note that `<<` is assignment operator, while `=` is binding operator.  
// When a name is binded with a value, it's value cannot be changed anymore
    

function
insert: element@T :to: tree@BinaryTree{T} >> BinaryTree{T}
    if tree.value is == nil
        tree.value << element
        >> tree
    elif element is <= tree.value
        >> insert: element :to: tree.left
    els
        >> insert: element :to: tree.right
    

function
tree@BinaryTree{T} :hasNoChild >> Boolean
    >> tree.value 
        and tree.left 
        and tree.right 
        is == nil

function
element@T :in: tree@BinaryTree{T} >> Boolean
    >> element is == tree.value 
        or is == tree.left 
        or is == tree.right 
        or is :in: tree.left 
        or is :in: tree.right
```

```ts
// Using binary tree
from ./binaryTree.pine import 
    BinaryTree
    insert_to_
    _contains_

let myTree: BinaryTree <<
    .value = 99

myTree << insert 5 to myTree

if 5 is in myTree
    print `It contains 5`
else 
    print `Nope`
```

## Inheritance
You can inherit a type by using the keyword `extend`.

Multiple inheritance is also allowed.
```ts
type Human
    .name @ String
    .dob  @ Date

type Parent extend Human
    .kids @ Human[]

type Worker
    .salary @ Decimal

// multiple inheritance
type SuperWoman extend Parent & Worker
    .busy @ Boolean
    

```

## Interface
You can define an interface using `interface`.  
```
interface Comparable
    x@T (>)  y@T >> Boolean
    x@T (==) y@T >> Boolean

type Color 
    .red   @ int
    .green @ int
    .blue  @ int
    implement Comparable

function
x@Color (>) y@Color >> Boolean
    >> x.red   is > y.red   and
       x.green is > y.green and
       x.blue  is > y.blue 
    
// Error: type `Color` did not implement `x@T (==) y@T` from interface `Comparable`
```
If we didn't declare the required functions, the Pineapple compiler will throw error.

## Why do we need interface?
Interface is especially useful for making generic function such as sorting function.  
For example, look at this `quicksort` example.

```hs
function
quicksort xs@T[] >> T where T@Comparable
    if xs is :empty 
        >> []
    let pivot = xs.{1}
    let left,right  = partition: xs :by: (is > pivot)
    >> (quicksort: left) ++ [pivot] ++ (quicksort: right)
```

# Classes
There no classes in Pineapple! However you can simulate that using suffix function.

## Example: BinaryTree
```java
// Definition of BinaryTree
@type 
BinaryTree<T>:
    .left  : BinaryTree<T> | null
    .right : BinaryTree<T> | null
    .value : T
    where T: Comparable

@function
newTree (value: T) -> tree
    result =
        .left  <- null
        .right <- null
        .value =  value
    -> result
// Note that `<-` is assignment operator, while `=` is binding operator.  
// When a name is binded with a value, it's value cannot be changed anymore
    
@function
insert (element: T) to (tree: BinaryTree<T>) -> BinaryTree
    if tree.left is == null
        tree.left <- newTree element
    elif element > tree.left
        if tree.right is == null
            tree.right <- newTree element
        else
            insert element to tree.right
    else 
        insert element to tree.left
    -> tree

@function
(tree: BinaryTree) hasNoChild -> Bool
    -> tree.left is == null and tree.right is == null

@function
element:T in tree:BinaryTree -> Bool
    -> element is == tree.value 
        or == tree.left 
        or == tree.right 
        or in tree.left 
        or in tree.right
```

```ts
// Using binary tree
from ./binaryTree.pine import 
    BinaryTree
    insert_to_
    _contains_

let myTree: BinaryTree <-
    .left = null
    .right = null
    .value = 99

myTree <- insert 5 to myTree

if 5 is in myTree
    print "It contains 5"
else 
    print "Nope"
```

## Inheritance
You can inherit a type by using the keyword `extends`.

Multiple inheritance is also allowed.
```ts
@type 
Human:
    name: String
    dob: Date

@type 
Parent extends Human:
    kids: Human[]

@type
Worker:
    salary: Number

// multiple inheritance
@type
SuperWoman extends Parent & Worker:
    isBusy: Bool

```

## Interface
You can define an interface using `@interface`.  
```java
@interface 
Comparable:
    x:T (>)  y:T -> Bool
    x:T (==) y:T -> Bool

@type
Color implements Comparable:
    .red  : int
    .green: int
    .blue : int

@function
x:Color (>) y:Color -> Bool
    -> x.red   is > y.red   and
       x.green is > y.green and
       x.blue  is > y.blue 
    
// Error: type `Color` did not implements `x:T (==) y:T` from interface `Comparable`
```
If we didn't declare the required functions, the Pineapple compiler will throw error.

## Why do we need interface?
Interface is especially useful for making generic function such as sorting function.  
For example, look at this `quicksort` example.

```js
@function
quicksort xs:T[] -> T where T:Comparable
    if xs is empty -> []
    let pivot = xs.(1)
    let left  = from xs where (item not > pivot)
    let right = from xs where (item is > pivot)
    -> left ++ [pivot] ++ right

```

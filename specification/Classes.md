# Classes
There no classes in Pineapple! However you can simulate that using suffix function.

## Example: BinaryTree
```java
// Definition of BinaryTree
@type 
BinaryTree:
    .left  : Node | null
    .right : Node | null
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
insert (element: T) to (tree: BinaryTree) -> BinaryTree
    if tree.left == null
        tree.left <- newTree element
    elif element > tree.left
        if tree.right == null
            tree.right <- newTree element
        else
            insert element to tree.right
    else 
        insert element to tree.left
    -> tree

@function
(tree: BinaryTree) hasNoChild -> Boolean
    -> tree.left == null and tree.right == null

@function
(tree: BinaryTree) contains (element: T) -> Boolean
    -> tree.value == element or
       tree.left  == element or
       tree.right == element or
       tree.left  contains element or
       tree.right contains element

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

if myTree contains 5 
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
SuperWoman extends Parent, Worker:
    isBusy: Boolean

```

## Interface
You can define an interface using `@interface`.  
```java
@interface 
Comparable:
    (x: T) greaterThan (y: T) -> Boolean
    (x: T) equals (y: T) -> Boolean

@type
Color implements Comparable:
    .red  : int
    .green: int
    .blue : int

@function
(x: Color) greaterThan (y: Color) -> Boolean
    -> x.red   > y.red   and
       x.green > y.green and
       x.blue  > y.blue 
    
// Error: type `Color` did not implements `(x: T) equals (y: T)` from interface `Comparable`
```
If we didn't declare the required functions, the Pineapple compiler will throw error.

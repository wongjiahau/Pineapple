# Classes
There no classes in Pineapple! However you can simulate that using suffix function.

## Example: BinaryTree
```python
# Definition of BinaryTree
type BinaryTree:
    .left  : Node | null
    .right : Node | null
    .value : T
    where T: Comparable

@function
newTree (value: T) => tree
    result =
        .left  = null
        .right = null
        .value = value
    => result
    
@function
insert (element: T) to (tree: BinaryTree) => BinaryTree
    if tree.left == null
        tree.left = newTree element
    elif element > tree.left
        if tree.right == null
            tree.right = newTree element
        else
            insert element to tree.right
    else 
        insert element to tree.left
    => tree

@function
(tree: BinaryTree) hasNoChild => boolean
    => tree.left == null and tree.right == null

@function
(tree: BinaryTree) contains (element: T) => boolean
    => tree.value == element or
       tree.left  == element or
       tree.right == element or
       tree.left  contains element or
       tree.right contains element

```

```python
# Using binary tree
from ./binaryTree.pine import *

var myTree: BinaryTree<int> = 
    .left = null
    .right = null
    .value = 99

myTree = insert 5 to myTree

if myTree contains 5
    -> print "It contains 5"
else 
    -> print "Nope"
```

## Inheritance
You can inherit a type by using the keyword `extends`.

```ts
type Human:
    name: string
    dob: Date

type Parent extends Employee:
    kids: Human[]

```

## Interface
You can define an interface using `interface`.
```coffee
interface IComparable:
    (x: T) greaterThan (y: T) => boolean
    (x: T) equals (y: T) => boolean

type Color implements IComparable:
    .red  : int
    .green: int
    .blue : int

(x: Color) greaterThan (y: Color) => boolean
    => x.red   > y.red   and
       x.green > y.green and
       x.blue  > y.blue 
    
# Error: type `Color` did not implements `(x: T) equals (y: T)` from interface `IComparable`
```
If we didn't declare the required functions, the Pineapple compiler will throw error.

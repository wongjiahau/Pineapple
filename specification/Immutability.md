# Immutability
Every value in Pineapple is implicitly immutable, thus if something is mutable, it must be declared as so.

The following shall demonstrate on how to declare mutables.

## Mutable variable
A variable can be mutable by using the `<<` operator.
```ts
let $x = 4
$x = 5  // Error
$x << 5 // Error

let $y << 4
$y << 5 // No error
```

## Mutable array
A mutable array can be declared using `mutable` keyword.
Note that mutable array means that its element can be changed, however it sized is fixed.
```ts
let $x = [1,2,3,4]
$x.[1] = 0  // Error
$x.[1] << 0 // Error


let $y = mutable [1,2,3,4]
$y.[1] << 123   // No error
$y << [1,2,3,4] // Error

let $z << mutable [1,2,3,4]
$z.[1] << 123 // No error
$z << [1,2,3] // No error

$z << replaceIndex 1 with 123 in $z
```

## Mutable object
```ts
let $obj1  = 
    .name  = `hello`
    .price << 99

$obj.name = `yo` // Error
$obj.price << 123 // No error
```

## Mutable list of object
```ts
let $x : mutable List of mutable Fruit = mutable []
```

## Generics
```
@blueprint
BinaryTree of T:
    .value : T
    .left  : BinaryTree of T | nil
    .right : BinaryTree of T | nil
```

## Quicksort
```
@function
quicksort $xs:(List of T) >> List of T where T:Comparable
    let $pivot = $xs.[1]
    let $left $right = partition $xs by (_ < $pivot)
    return (quicksort $left) ++ [$pivot] ++ (quicksort $right)
```
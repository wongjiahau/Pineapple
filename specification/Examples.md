# Examples
## Bubblesort
```java
@function 
bubblesort xs:Comparable[] -> Comparable[]
    let ys = mutable xs
    loop ys.length times
        for i in 2 to xs.length
            if ys.(i-1) > ys.(i)
                ys.(i-1), ys.(i)  <- [ys(i), ys.(i-1)]
    -> ys
```

## Mergesort
```java
@function
mergesort xs:T[] -> T[] where T:Comparable
    let middle     = floor (xs.length / 2)
    let firstHalf  = xs.(..<middle)
    let secondHalf = xs.(middle..)
    -> (mergesort firstHalf) merge (mergesort secondHalf)

@function
xs:T[] merge ys:T[] -> T[] where T:Comparable
    if xs == [] -> ys
    if ys == [] -> xs
    if xs.(1) < ys.(1)
        -> [xs.(1)] ++ (xs.(2..) merge ys)
    else 
        -> [ys.(1)] ++ (xs merge ys.(2..))

```

## Quicksort
```java
@function
quicksort xs:T[] -> T[] where T:Comparable
    if xs == [] -> []
    let pivot = xs.(0)
    let left  = for x in xs take x if x < pivot
    let right = for x in xs take x if x > pivot
    -> (quicksort left) ++ [pivot] ++ (quicksort right)

```
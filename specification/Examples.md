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
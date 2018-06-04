# Examples
## Bubblesort
```java
@function 
bubblesort xs:Comparable[] >> Comparable[]
    let ys = mutable xs
    loop ys.length times
        for i in 2 to xs.length
            if ys.(i-1) > ys.(i)
                ys.(i-1), ys.(i)  << [ys(i), ys.(i-1)]
    >> ys
```

## Mergesort
```java
@function
mergesort xs:T[] >> T[] where T:Comparable
    let middle     = floor (xs.length / 2)
    let firstHalf  = xs.(..<middle)
    let secondHalf = xs.(middle..)
    >> (mergesort firstHalf) merge (mergesort secondHalf)

@function
xs:T[] merge ys:T[] >> T[] where T:Comparable
    if xs == [] >> ys
    if ys == [] >> xs
    if xs.(1) < ys.(1)
        >> [xs.(1)] ++ (xs.(2..) merge ys)
    else 
        >> [ys.(1)] ++ (xs merge ys.(2..))

```

## Quicksort
```java
@function
quicksort xs:T[] >> T[] where T:Comparable
    if xs == [] >> []
    let pivot = xs.(0)
    let left  = for x in xs take x if x < pivot
    let right = for x in xs take x if x > pivot
    >> (quicksort left) ++ [pivot] ++ (quicksort right)

```

## Web scrapping
```ts
@function
from parent:HTMLElement getContestants >> Contestant[]
    let result: Contestant[] << [];
    for element in from parent find "div.progress-wrapper"
        let nameAndParty = from element find "p.name-candidate" >> _.text >> split _ by "("
        let votes        = from element find "div.number-of-voters" >> _.text >> split _ by "%"
        let contestant: Contestant = 
            .isWinner       = from element find "i.fa-check" >> _.length > 0
            .name           = nameAndParty.(1) >> trim _
            .partyName      = nameAndParty.(2) >> trim _ >> _.(..-2)
            .voteCount      = votes.(2) 
                              >> from _ remove ","
                              >> trim _ 
                              >> _.(2..-2) 
                              >> parse _ asInt
            .votePercentage = votes.(1) >> parse _ asFloat 
        
        result << result ++ [contestant];
    >> result
```
# Design by contract
You can use this feature by using the `makesure` keyword.

For example, let say you have a function that will add two arrays.  
For example `[1,2,3] + [1,2,3]` will result in `[2,4,6]`. 

Since you don't want to add array of different length together, you can use this Design-by-contract feature.
```
function
x@Int[] (+) y@Int[] >> Int[]
    makesure x.length is == y.length
    let result << []
    for i in range: 1 :to: x.length
        let next = x.{i} + y.{i}
        result << result ++ [next]
    >> result
```
## Function piping
In Pineapple, you can pipe the output of a function to another function using the pipe-forward operator `>>` and the input operator `_`.

Let's look at an simple example.



```js
let sample0 = "pine" >> _ ++ "apple" 

print sample0 // "pineapple"

let sample1 = 22 >> _ + 3 >> [10] ++ [_]

// The operation above is same as the following
let sample2 = [10] ++ [20 + 3]

print sample1 // [10, 25]


```

Another example for Euclidean distance between two points.
```
@function
Point:
    .x: Number
    .y: Number

@function 
euclideanDistanceBetween a:Point and y:Point -> Number
    -> [a.x - b.x , a.y - b.y]
    >> for x in _ take x^2
    >> sum _ 
    >> squareRoot _
```
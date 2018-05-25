## Function piping
In Pineapple, you can pipe the output of a function to another function using the pipe-forward operator `>>` and the input operator `_`.

Let's look at an simple example.



```js
let sample0 = "pine" >> _ ++ "apple" 

print sample0 // "pineapple"

let sample1 = 22 
            >> _ + 3 
            >> [10] ++ [_]

// The operation above is same as the following
let sample2 = [10] ++ [20 + 3]

print sample1 // [10, 25]


```

Another example for Euclidean distance between two points.
```java
@function
Point:
    .x: Number
    .y: Number

@function 
euclideanDistanceBetween a:Point and b:Point -> Number
    -> [a.x - b.x , a.y - b.y]
    >> for x in _ take x^2
    >> sum _ 
    >> squareRoot _
```

## Piping multiple values
You can pipe multiple values by using tuple deconstruction.  For example,
```ts
let result = [1, 2, 3] >> _ + _ - _
print result // 3

let problem = [1, 2, 3] >> _ + _  // Error, cant deconstruct 3 elements into 2
```

## Piping to access object values
You can even pipe to access object values!
```ts
let fruit = 
    .name  = "Pineapple"
    .sweet = true

fruit >> _.name >> print _ // "Pineapple"
```

## Nested piping
You can nest piping by grouping them using brackets.
```ts
let result = (["pine", "apple"] >> _ ++ _) >> _.length
print result // "9"
```
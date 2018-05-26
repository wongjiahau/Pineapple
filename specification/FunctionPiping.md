## Function piping
In Pineapple, you can pipe the output of a function to another function using the pipe-forward operator `>>` and the input operator `_`.

Let's look at an simple example.



```js
let sample0 = `pine` >> _ ++ `apple` 

print sample0 // `pineapple`

let sample1 = 22 
            >> _ + 3 
            >> [10] ++ [_]

// The operation above is same as the following
let sample2 = [10] ++ [20 + 3]

print sample1 // [10, 25]


```
Now, let's look at a example of Euclidean distance (without function piping)
```js
@function
euclideanDistanceBetween a:Number[] and b:Number[] -> Number
    let diff   = b - a
    let square = map (^2) to diff
    let sums   = sum square
    let root   = squareRoot sums
    -> root
```
With function piping, it will look a lot cleaner (see the following)
```js
@function 
euclideanDistanceBetween a:Number[] and b:Number[] -> Number
    -> b - a
    >> map (^2) to _
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
    .name  = `Pineapple`
    .sweet = true

fruit >> _.name >> print _ // `Pineapple`
```

## Nested piping
You can nest piping by grouping them using brackets.
```ts
let result = ([`pine`, `apple`] >> _ ++ _) >> _.length
print result // "9"
```

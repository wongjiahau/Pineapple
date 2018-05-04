# Arrays/Lists
Arrays are just like Python arrays. However, they must consist of the same type, no array with mixed typed is allowed.

## Initialization
```js
xs = [1,2,3,4]

invalidList = [1, "b"] // Error: Cannot contain different type in a list

manyFruits = [
    {.name="Apple"     .color="red"},
    {.name="Pineapple" .color="yellow"}
]


```

## Indexing
Indexing is done using the dot (`.`) operator (same as OCaml).
The first element will have the index of zero.
```python
xs = [1,2,3,4]

# Get first element
mylist.(0)

# Get last element
xs.(-1) # 4
```

## Slicing
To get a range of number, you can use the keyword `till`.
```python
xs = [10, 20, 30, 40]

# Get until element 1
xs.(0 till 1) # [10,20]

# Get from element 1 onward
# Remember that -1 means last
xs.(1 till -1) # [20,30,40]

# Get from element 1 to element 3
xs.(1 till 3) # [20,30,40]
```

## How to get range of numbers?
You can do that by using the utility function `to`.
```python
x = 1 to 5 # [1,2,3,4,5]
y = -2 to 2 # [-2,-1,0,1,2]
```
### Definition of `to`
```java
@function
(start:number) to (end:number) => number[]
    if start == end => [start]
    => (start to (end - 1)) eat end
```
`eat` is a core function in Pineapple, it's like a reversed `cons` in Haskell.  
Example:
```python
[] eat 1 # [1]
[1] eat 1 # [1,1]
[9,8,7] eat 3 # [9,8,7,3]
[1,2,3] eat [1,2,3] # Error: the signature of eat is (eater:T[]) eat (food:T) => T[]
```
In fact, list are just syntax sugar for `eat`.  
For example, `[1,2,3]` will be converted into `[] eat 1 eat 2 eat 3`.  
With `eat` you can create recursive functions and also used pattern matching.   

To demonstrate, look at the definition of `sum` function.

```java
// Pineapple
@function
sum (xs eat x : number[]) => number
    => 0 if xs == [] else x + sum xs
```
In Haskell, the function looks like :
```hs
-- Haskell
sum :: (Eq p, Num p) => [p] -> p
sum (x:xs) = if xs == [] then 0 else x + sum xs
```


## Mutability
By default, you cannot change the member of an array.  For example :
```python
xs = [1, 2, 3, 4]

# Change the last element to 99
xs.(-1) <- 99 # Compile error
```
However, if you want to declare an array which is immutable, you need to use the `mutable` keyword.  
```python
xs = mutable [1,2,3,4]
xs.(-1) <- 99 # No error
```

## Strings
Strings are actually list of characters, so you can apply list operation on `string` as well.
```python
message = 'Pineapple'
message.(4 till -1) # 'apple'
```


## List comprehension
```python
fruits = ['apple', 'banana', 'pineapple']
longNameFruits = foreach fruit in fruits take fruit if fruit.length > 5 # ['banana', 'pineapple']

xs = [1,2,3,4,5]
newList = foreach x in xs take x*2 # [1,3,9,16,25]
```
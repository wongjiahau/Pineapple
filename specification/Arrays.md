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
The first element will have the index of zero.
```python
xs = [1,2,3,4]

# Get first element
xs[0] # 1

# Get last element
xs[-1] # 4
```

## Slicing
The slicing is a little different from Python, it will be easier to understand in Pineapple.
```python
xs = [10,20,30,40]

# Get all
xs[:] # [10,20,30,40]

# Get until element 1
xs[0 to 1] # [10,20]

# Get from element 1 onward
# Remember that -1 means last
xs[1 to -1] # [20,30,40]

# Get from element 1 to element 3
xs[1 to 3] # [10,20,30]

```

## Mutability
By default, you cannot change the member of an array.  For example :
```python
xs = [1, 2, 3, 4]

# Change the last element to 99
xs[-1] <- 99 # Compile error
```
However, if you want to declare an array which is immutable, you need to use the `mutable` keyword.  
```python
xs = mutable [1,2,3,4]
xs[-1] <- 99 # No error
```

## Strings
Strings are actually list of characters, so you can apply list operation on `string` as well.
```python
message = 'Pineapple'
message[4 to -1] # 'apple'
```


## List comprehension
```python
fruits = ['apple', 'banana', 'pineapple']
longNameFruits = [foreach fruit in fruits take fruit if fruit length > 5] # ['banana', 'pineapple']

xs = [1,2,3,4,5]
newList = [foreach x in xs take x*2] # [1,3,9,16,25]
```
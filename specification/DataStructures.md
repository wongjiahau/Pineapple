# Data structure
## Objects
The data structure will be using the format of PON (Pinapple Object Notation). It is just a variant of JSON that is more readable with lesser typing.

```java
// Initialization
myFruit = 
    .name    = "Mango" 
    .isTasty = true
    .sibling = 
        .name    = "Durian"
        .isTasty = false
        .sibling = null

-> print myFruit.sibling.name // "Durian"
-> print myFruit["name"]  // "Mango"
```

Note that the indentation is not necessary. It's just for making the code easier to read.

So, you may also declare them in one line, but you will need to put brackets.
```ts
myFruit =(.name="Mango" .isTasty=true .sibling=(.name="Durian" .isTasty=false .sibling=null))
```

### How to declare an empty object?
```js
var x = () // This is similar to {} in Javascript/Python
```

## Arrays/Lists
Arrays are just like Python arrays. However, they must consist of the same type, no array with mixed typed is allowed.

### Initialization
```js
xs = [1,2,3,4]

invalidList = [1, "b"] // Error: Cannot contain different type in a list

rangeOfNumbers = [1 to 5] // [1,2,3,4,5]

manyFruits = [
    (.name="Apple" .color="red"),
    (.name="Pineapple" .color="yellow")
]


```

### Indexing
```python
xs = [1,2,3,4]

# Get first element
xs[0] # 1

# Get last element
xs[-1] # 4
```

### Slicing
The slicing is a little different from Python, it will be easier to understand in Pineapple.
```python
xs = [10,20,30,40]

# Get all
xs[:] # [10,20,30,40]

# Get until element-1
xs[:1] # [10,20]

# Get from element-1 onward
xs[1:] # [20,30,40]

# Get from element-1 to element-3
xs[1:3] # [10,20,30]

```

### List comprehension
```python
fruits = ['apple', 'banana', 'pineapple']
longNameFruits = [foreach fruit in fruits take fruit if fruit length > 5] # ['banana', 'pineapple']

xs = [1,2,3,4,5]
newList = [foreach x in xs take x*2] # [1,3,9,16,25]
```
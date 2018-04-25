# Data structure
## Objects
The data structure will be using the format of PON (Pinapple Object Notation)
```ts
// Definition
type Fruit:
.name       : string
.isTasy     : boolean
.sibling    : Fruit | null

// Initialization
let myFruit: Fruit = 
    .name    = "Mango" 
    .isTasty = true
    .sibling = 
        .name    = "Durian"
        .isTasty = false
        .sibling = null

print~myFruit.sibling.name // "Durian"
```

Note that the indentation is not necessary.  

So, you may also declare them in one line
```ts
let myFruit: Fruit = .name="Mango" .isTasty=true .sibling= .name="Durian" .isTasty=false .sibling=null 
```

You may also use bracket to group them together, but that is optional
```ts
let myFruit: Fruit =(.name="Mango" .isTasty=true .sibling=(.name="Durian" .isTasty=false .sibling=null))
```

## Arrays
Arrays are just like Python arrays.

### Initialization
```python
let xs = [1,2,3,4]
```

### Indexing
```python
let xs = [1,2,3,4]

# Get first element
xs[0] # 1

# Get last element
xs[-1] # 4
```

### Slicing
The slicing is a little different from Python, it will be easier to understand in Pineapple.
```python
let xs = [10,20,30,40]

# Get all
xs[:] # [10,20,30,40]

# Get until element-1
xs[:1] # [10,20]

# Get from element-1 onward
xs[1:] # [20,30,40]

# Get from element-1 to element-3
xs[1:3] # [10,20,30]

```

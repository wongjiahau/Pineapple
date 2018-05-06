# Module
All function is exported by default.  
## How to import function from another file?
Let say you have the file `math.pine`.

```java
@function
(x: Number) add (y: Number) -> Number
    -> x + y

@function
(x: Number) isEven -> Boolean
    -> x % 2 == 0

@function
sum (xs: Number[]) -> Number
    var result = 0
    foreach x in xs
        result += x
    -> result
```

Note that underscore ( `_` ) is a reserved symbol to identify if a function is suffix, prefix, infix or hybrid.

The file path is using UNIX filepath notation, such as
- Current directory `./`  
- Parent directory `../`
- Root directory `/`
```python
from ./math.pine import _add_ , _isEven_ , sum_


-> print sum [1,2,3] toString

```


## How to import every function from a file?
You can't do that like you would in language such as Python or Typescript, because it will be hard to find out where did the function comes from. 

## How to not export a function from a file?
By using the `@private` annotation.
```java
@private function
(x: Number) add (y: Number) -> Number
    -> ??
```

# Module
All function is exported by default.  
## How to import function from another file?
Let say you have the file `math.pine`.

```python
(x: number) add (y: number) => number
    => x + y

(x: number) isEven => boolean
    => x % 2 == 0

sum (xs: number[]) => number
    var result = 0
    foreach x in xs
        result += x
    => result
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
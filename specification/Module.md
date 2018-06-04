# Module
## Note
All function is exported by default.  

## How to import function from another file?
Let say you have the file `math.pine`.

```
function
x@Number :add: y@Number >> Number
    >> x + y

function
x@Number :isEven >> Boolean
    >> x % 2 == 0

function
sum xs@Number[] >> Number
    if xs is == []
        >> []
    else
        >> xs.{1} + (sum: xs.{2..})
```

The file path is using UNIX filepath notation, such as
- Current directory `./`  
- Parent directory `../`
- Root directory `/`



## How to import every function from a file?
By using the `import` keyword.  
When you do this, all the `function` defined in `math.pine` will be exposed to the current file.
```python
import ./math.pine

print: (sum: [1,2,3])
```

## How to not export a function from a file? 
QUESTION: Is this function necessary?

By using the `private` annotation.
```
private function
x@Number :add: y@Number >> Number
    >> x + y
```
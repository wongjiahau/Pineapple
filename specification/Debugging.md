# Debugging
You can set a breakpoint by typing  `//<<<`.

For example,
```js
var x = 5
y = 7
x += 1 //<<<
```

By adding the `//<<<` operator, the interpreter will run until that line, then it will show a table regarding value of all the variables within the debug scope.
```
Breakpoint encountered at line 3.
__________________________________________
| NAME | TYPE | VARIABLE | CURRENT_VALUE |
|======|======|==========|===============|
|  x   | int  |   yes    |      6        |
|  y   | int  |    no    |      7        |
------------------------------------------

Press any key to continue . . .
```
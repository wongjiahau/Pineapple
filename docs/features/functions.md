# Functions
All functions in Pineapple are postfix-oriented, meaning that the function names comes after parameter.  

In general, there are 5 kinds of functions: <i>Nullifunc, Monofunc, Bifunc, Trifunc and Polyfunc. </i>

## Notes
Before you continue reading, you should know the following rules:

- Function name are always started with a dot. There are no exceptions.
    - For example, `.show`
- You cannot separate the parameters using comma.
- Every function definition must start with a `def` keyword.
- By convention, parameters names are usually `this`, `that` or `the`. 

Now, you can enjoy the following docs.


<hr>
## Nullifunc (0 param)
Nullifunc is a function that do not need any parameters, for example:
```scala
// Here's how you define a nullifunc
def .pi -> Number
    return 3.142
 
// Here's how you call a nullifunc
let x = .pi
```

<hr>
## Monofunc (1 param)
Monofunc is a function that takes only 1 parameter.  
Note that the parameter must be at front. For example:
```scala
// here's how you declare a monofunc
def (this Number).square -> Number
    return this * this

// here's how you call a monofunc
let x = 99.square
```
Notes: `this` is not a keyword, it is just a variable name!

<hr>
## Bifunc (2 params)
Bifunc is a function that takes 2 params.  
Since you cannot separate params with comma, the only way is to put the name in the middle.  
For example,
```scala
// here's how you define a bifunc
def (this Number).plus(that Number) -> Number
    return this + that
```




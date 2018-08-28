# Functions
All functions in Pineapple are postfix-oriented, meaning that the function names comes after parameter.  

In general, there are 4 kinds of functions: <i>Nullifunc, Monofunc, Bifunc, Trifunc and Quadfunc. </i>

## Notes
Before you continue reading, you should know the following rules:

- Function name are always started with a dot. There are no exceptions.
    - For example, `.show`
    - Not only that, `.` is also a valid function name!
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
`-> Number` means that the `.pi` function will return a `Number` type.

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

// you can chain it!
let y = 2.square.square.square
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

// here's how you call a bifunc
let x = 99.plus(99).plus(22)
```

## User-defined operators
In Pineapple, Bifunc is a special type of function, because you can use symbols as the function name. For example,
```scala
// Here's how you define a operator bifunc
def (this List{Number}) + (that List{Number}) -> List{Number}
    let result mutable List{Number} = []
    for i in this
        result = result.append(this.(i) + that.(i))
    return result

// Here's how you call it
let x = [1,2,3] + [4,5,6]
```

<hr>
## Trifunc (3 params)
Trifunc is a function that takes 3 params.
As mentioned before, you cannot separate params with comma.  
So, you should separate them with an identifier.  
For example,
```scala
// Here's how you define a trifunc
def (this String).replace(old String with new String) -> String
    pass

// Here's how you call a trifunc
let x = "Hello world".replace("world" with "baby")
```
Note that `with` is not a keyword, it is a **sub-function-identifier**, it means that you can use any word you like as long as it is a single alphabetical word without spaces!  

Just to make it clear, let see another trifunc example:
```scala
// Defining a trifunc
def (this Socket).send(message String to portNumber Integer)
    pass

// Here's how you use it
mySocket.send("Hello world" to 8080)
```
In this case, `to` is the **sub-function-identifier**.  

### Why?
Pineapple enforces this rules so that every function can be understood better.  
Compare the following functions:

```js
// Javascript
replace("Hello", "el", "lo") // Hmm, is it replacing "el" or "lo" ?
```

```js
// Pineapple
"Hello".replace("el" with "lo") // I am very sure it is replacing "el" with "lo"!
```

There are at least 2 advantages with it:  
- First, you don't need to write too much documentation about your function, as the name already tells the meaning  
- Secondly, when others read your code, they can understand faster

<hr>
## Polyfunc (4 or more params)
Polyfunc is a function that takes 4 or more params.  
It is similar as Trifunc, but it needs 2 or more **sub-function-identifier**.  
For example,
```scala
// Here's how you define a Polyfunc with 4 parameters
def (this String).replace(startIndex Int to endIndex Int with new String) -> string
    pass

// Here's how you call it
let x = "Hello world".replace(0 to 4 with "Hi")
```
<hr>
## Tips
Sometimes, your function might require a lot of parameters.  
In such case, defining functions like this would be dreadful.  
So, you should pack those parameters into a single structure.  
For example,
```
def RequestParam
    'url    String
    'method String
    'body   String
    'schema String

def (this Server).send(that RequestParam)
    pass
```
Example of usage:
```js
let param = RequestParam
    'url    = "192.168.0.0/api/people"
    'method = "POST"
    'body   = `{"name": "Johnny", "age": 999}`
    'schema = "FREE"

myServer.send(param)
```

<hr>
## What's the difference of Pineapple function with named parameters?
Look at the following example to understand the difference.
```python
# Python
replace(target="Hello world", old="lo", new="wo")
```
```scala
// Pineapple
"Hello world".replace("lo" with "wo")
```
Obviously, the Pineapple's version is much more clearer than Python's version.  
Moreover, it is also shorter!

Actually, the Pineapple's way of defining function is also known as **mixfix** function, and that's how it is different from **named parameters**.




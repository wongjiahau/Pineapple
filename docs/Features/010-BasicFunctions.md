# Functions

## Introduction

All functions in Pineapple are postfix-oriented, meaning that the function names comes after parameter.  

In general, there are 5 kinds of functions: 

| Name | Meaning |
|--|--|  
|Nullifunc|Function that don't take any parameters.|
|Monofunc|Function that only 1 parameters.|
|Bifunc|Function that only 2 parameters.|
|Trifunc|Function that only 3 parameters.|
|Polyfunc|Function that 4 or more parameters.|

!!! info "Note"

    - Function name are always started with a dot. There are no exceptions.

        - For example: `#!pine .show` 

        - Not only that, `.` is also a valid function name!

    - You cannot separate the parameters using comma.

    - Every function definition must start with a `#!pine def` keyword.

    - By convention, parameters names are usually `#!pine this`, `#!pine that` or `#!pine the`. 

<hr>
## Nullifunc (0 parameter)
Nullifunc is a function that do not need any parameters, for example:
```pine
// Here's how you define a nullifunc
def .pi -> Number
    return 3.142
 
// Here's how you call a nullifunc
let x = .pi
```

!!! info "Note"
    `#!pine -> Number` means that the `#!pine .pi` function will return a `#!pine Number` type.

<hr>

## Monofunc (1 parameter)

Monofunc is a function that takes only 1 parameter.  
Note that the parameter must be at front. For example:
```pine
// here's how you declare a monofunc
def (this Number).square -> Number
    return this * this

// here's how you call a monofunc
let x = 99.square

// you can chain it!
let y = 2.square.square.square
```

!!! info "Note"
    `#!pine this` is not a keyword, it is just a variable name!

<hr>
## Bifunc (2 parameters)
Bifunc is a function that takes 2 parameters.  
Since you cannot separate parameters with comma, the only way is to put the name in the middle.  

For example:

```pine
// here's how you define a bifunc
def (this Number).plus(that Number) -> Number
    return this + that

// here's how you call a bifunc
let x = 99.plus(99).plus(22)
```

## User-defined operators
In Pineapple, Bifunc is a special type of function, because you can use symbols as the function name. For example:
```pine
// Here's how you define a operator bifunc
def (this List{Number}) + (that List{Number}) -> List{Number}
    pass

// Here's how you call it
let x = [1,2,3] + [4,5,6]
```

!!! info "Note"
    `#!pine pass` means that the implementation of the function is temporarily passed.  
    You can think of it as throwing `#!pine NotImplementedException`.

<hr>
## Trifunc (3 parameters)
Trifunc is a function that takes 3 parameters.
As mentioned before, you cannot separate parameters with comma.  
So, you should separate them with an identifier.  
For example,
```pine
// Here's how you define a trifunc
def (this String).replace(old String with new String) -> String
    pass

// Here's how you call a trifunc
let x = "Hello world".replace("world" with "baby")
```

!!! info "Note"
    `#!pine with` is not a keyword, it is a *sub function identifier*, it means that you can use any word you like as long as it is a single alphabetical word without spaces!  

Just to make it clear, let see another Trifunc example:
```pine
// Defining a trifunc
def (this Socket).send(message String to portNumber Integer)
    pass

// Here's how you use it
mySocket.send("Hello world" to 8080)
```
In this case, `to` is the *sub function identifier*.  

!!! faq "Why is the *sub function identifier* necessary?"
    Pineapple enforces this rules so that every function can be understood better.  
    Compare the following functions:

    ```pine
    // Javascript
    replace("Hello", "el", "lo") // Hmm, is it replacing "el" or "lo" ?
    ```

    ```pine
    // Pineapple
    "Hello".replace("el" with "lo") // I am very sure it is replacing "el" with "lo"!
    ```

    There are at least 2 advantages with it:  

    - First, you don't need to write too much documentation about your function, as the name already tells the meaning  

    - Secondly, when others read your code, they can understand faster

<hr>
## Polyfunc (4 or more parameters)
Polyfunc is a function that takes 4 or more parameters.  
It is similar as Trifunc, but it needs 2 or more *sub function identifiers*.  
For example,
```pine
// Here's how you define a Polyfunc with 4 parameters
def (this String).replace(startIndex Integer to endIndex Integer with new String) -> String
    pass

// Here's how you call it
let x = "Hello world".replace(0 to 4 with "Hi")
```
<hr>

!!! tip "Tips"
    Sometimes, your function might require a lot of parameters.  
    In such case, defining functions like this would be dreadful.  
    So, you should pack those parameters into a single structure.  
    For example,
    ```pine
    def RequestParam
        :url    String
        :method String
        :body   String
        :schema String

    def (this Server).send(that RequestParam)
        pass
    ```
    Example of usage:
    ```pine
    let param = RequestParam
        :url    = "192.168.0.0/api/people"
        :method = "POST"
        :body   = '{"name": "Johnny", "age": 999}'
        :schema = "FREE"

    myServer.send(param)
    ```

<hr>
## What's the difference of Pineapple function with named parameters?
Look at the following example to understand the difference.
```python
# Python
replace(target="Hello world", old="lo", new="wo")
```
```pine
// Pineapple
"Hello world".replace("lo" with "wo")
```
Obviously, the Pineapple's version is much more clearer than Python's version.  
Moreover, it is also shorter!

Actually, the Pineapple's way of defining function is also known as **mixfix** function, and that's how it is different from **named parameters**.




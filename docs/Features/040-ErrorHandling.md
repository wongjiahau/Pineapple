# Error Handling

The Pineapple's error handling model is largely inspired by the [Midori's Error Handling Model](http://joeduffyblog.com/2016/02/07/the-error-model/).

The following is an excerpt from the Midori's author:

> ## Bugs Aren’t Recoverable Errors!  
> A critical distinction we made early on is the difference between recoverable errors and bugs:
> 
> **A recoverable error** is usually the result of programmatic data validation. 

>> For example, text parsing, user input from a website, or a transient network connection failure. In these cases, programs are expected to recover. The developer who wrote this code must think about what to do in the event of failure because it will happen in well-constructed programs no matter what you do.  
>> The response might be to communicate the situation to an end-user, retry, or abandon the operation entirely, however it is a predictable and, frequently, planned situation, despite being called an “error.”
> 
> **A bug** is a kind of error the programmer didn’t expect.  
>> Inputs weren’t validated correctly, logic was written wrong, or any host of problems have arisen.  
>> Such problems often aren’t even detected promptly; it takes a while until “secondary effects” are observed indirectly, at which point significant damage to the program’s state might have occurred.  
>> Because the developer didn’t expect this to happen, all bets are off.  
>> All data structures reachable by this code are now suspect. 
>> And because these problems aren’t necessarily detected promptly, in fact, a whole lot more is suspect. 

Thus, Pineapple provided two mechanism:

- Try-catch-throw (TCT): To handle recoverable error

- Design-by-contract (DBC): To handle bug

---

## Try-catch-throw

Unlike languages like Java or JavaScript, in Pineapple, there isn't a base error class, so, you can throw anything you like. For example,

```pine
// Valid
throw "123" 

// Valid
throw 890 

// Valid
throw :errorDetail
    'code = "X23"
    'message = "Too hot!"
```

!!! tip "Why?"
    Having a base error class means that the compiler cannot help you to check which kind of error is or isn't handled. For example,

Moreover, even though checked exceptions (like those in Java) is not required, every function will have their throwing type inferred by the compiler. For example,

```pine
def .throwThings -> :nothing
    throw 123
    throw "123"

// .throwThings will be inferred as throwing :number or :string


def .main -> :nothing
    .throwThings

// .main will also be inferred as throwing :number or :string
```

### Handling thrown things

Handling thrown things (I don't say *error* because as mentioned before anything can be thrown) is nothing special, however the most top level function (usually `#!pine .main`) must handle all types of thrown thingy, if not the compiler will complain. ==This is to prevent nasty runtime exceptions.==

```pine
def this:string.open -> :string
    if this.exists.not
        throw "File does not exists"
    if this.havePermissionToBeOpened
        throw 999 // Just for demonstration purpose
    else
        return this.readlines

def .main -> :nothing
    try 
        let content = "Hello-world.pine".open
        content.show

    catch error:string
        error.show

    catch error:number
        error.show
```

### Under the hood

Under the hood, try/catch/throw is implemented as `Maybe`, so there is not much performance impact like the real `try/catch/throw` in language like C++ or Java.
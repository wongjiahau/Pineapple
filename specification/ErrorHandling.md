# Error Handling
To handle error, you can use the `try` and `catch` pattern.
```java
try
    let fileStream = open ./myFile.txt
catch error
    print error.message
    print error.stackTrace
```

## How to throw error?
Just use the `throw` operator.  
Note that you don't need to throw any error object, you just need to throw a `String`, and it will automatically help you wrap into an `Error` object.
```java
@function 
x:Int divide y:Int >> Int
    if y == 0 throw "Divisor cannot be 0"
    else >> x / y
```

## Catching error into variables
Sometimes, if you don't feel like to write a `try`-`catch` block to handle error, you can pack the error as an object and store it to a variable.

You can do so by adding the `try` word in front of an expression.
```js
let fileStream = try open ./myFile.txt
if fileStream.type == Error
    print fileStream.message
    print fileStrem.stackTrace
```

## No more religous arguments
Since you can do `try`-`catch` or return error as value in Pineapple, there is no need to argue about which method is better.  
Just use it when it is necessary. Remember that each method have its own pros and cons.

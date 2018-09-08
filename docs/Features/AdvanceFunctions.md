# Advance functions
## Multiple dispatch (Polymorphism)
Pineapple supports Multiple Dispatch, it means you can have different function with the same signature as long as they takes different types of parameters.

Multiple dispatch allows you to use Polymorphism easily without hassle.

For example:
```scala
// first plus function
def (this Number) + (that Number) -> Number
    pass

// second plus function
def (this String) + (that String) -> String
    pass

// third plus function
def (this List{Number}) + (that List{Number}) -> List{Number}
    pass


// Example of usage

12 + 13 // will call the first plus function

"12" + "13" // will call the second plus function

[1,2,3] + [4,5,6] // will call the third plus function

12 + "12" // error
```

<hr>
## Generic functions

!!! note "Pending"

<hr>
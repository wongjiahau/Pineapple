# Operators

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

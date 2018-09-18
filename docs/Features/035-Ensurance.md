# Ensurance

## Why is ensurance needed?

Although the type system had already prevented a lot of value errors, there are still cases where invalid value can still be passed in to some functions. 

Thus, Pineapple have a built-in feature called *Ensurance* to allow you to make sure that invalid value is not passed in into certain function.


!!! tip "Fun Fact"
    In another languages like C, Java or Python, ensurance is also known as assertion.

## How to use ensurance?

To use ensurance, just use the `#!pine ensure` keyword.

For example,

```pine
def (this Number).divide(that Number) -> Number
    ensure that != 0
    // performs division
```

Then, suppose we have the following program,

```pine
def .main
    let y = 4.divide(0)
```

When we run the program, we will get the following error message:

```
Ensurance failed:                         
                                                
        at  .divide  [example.pine:16:11]            
                                                
           > |   16 |     ensure that != 0      
             |      |            ~~~~~~~~~      
                                                
                                                
                                                
        at  .main  [example.pine:1:12]              
                                                
           > |    1 |     let y = 4.divide(0)   
             |      |             ~~~~~~~~~~~   

```

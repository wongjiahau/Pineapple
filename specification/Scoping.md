# Scoping
## 1. Statements within a function cannot access to variables outside of it 

For example,

```java
let x = 6

@iofunction 
sayHi >> Void
    print x // Error: `x` is not defined
```
### Reason
This is to ensure the function is clean, so that the it can be :
- tested easily
- debugged easily

## 2. Branch or loop blocks can access variable outside of it's scope
```java
@iofunction 
main args:String[] >> Int
    let x = 5
    if x > 3
        print x // No error

```
# Motivation
Since the Pineapple language is largely influenced by Haskell, Python, Javascript and Typescript, let's talk about what developers hate about them.

## Drawbacks of Python
### 1. Weakly/Dynamically Typed Members
Because Python is weakly typed, you will have a lot of runtime errors, for example:
```py
def add(x, y):
    return x + y

# No error
print(add(2,3)) # First line

# No error
print(add("12", "34")) # Second line

# Runtime error
print(add(12, "34")) # Third line
```
The example above will not have any compilation error, moreover, the *Second line* will also not throw any runtime error!  

Although the *Third line* will cause runtime error, but most of the time, Python programmers(including me) will shoot themselves in the foot due to the situation similar to *Second line*.

Not only that, you will sometimes see programmers writing boilerplates to check the type of the parameter:
```py
def add(x,y):
    if type(x) != int or type(y) != int:
        raise Exception("x and y must be type of int")
    return x + y
```
This is way too tiring when you compare this to some strongly typed language such as C :
```c
int add(int x, int y) {
    return x + y;
}
```
Which is shorter and prevent more bugs ahead.

### 2. No variable declaration
In Python, since you don't need to declare a variable before you use it, you will often encounter the following problem: 

```py
result = 1 + 2
reuslt = result + 3
print(result)
```
The problem with the code above is that there is actually a typo in line 2, where I mistyped `result` as `reuslt`, but because Python will run the code above without any compilation error or runtime error, I will spent quite sometime to figure out what is actually wrong, thus shooting in my own foot again.

So, the solution is to allow variable declaration, for example:
```py
let result = 1 + 2
reuslt = result + 3 # Compile error: `reuslt` is not a declared variable
print(result)
```



Referece: 
- https://medium.com/@natemurthy/all-the-things-i-hate-about-python-5c5ff5fda95e
- https://softwareengineering.stackexchange.com/questions/15468/what-are-the-drawbacks-of-python


## Drawbacks of Haskell
### 1. Very steep learning curve
Because learning Haskell is not just about learning the syntax, it's also about learning a new theory such as:
- functional purity
- currying
- monads
- laziness

### 2. Not popular
Althought Haskell offer a lot of benefits to programming, however it suffers in terms of popularity due to the steep learning curve, thus causing even professional Haskell programmer to NOT use Haskell in production because:
- It might be hard to communicate the code to other developers who does not know functional programming
- Hard to find community support (even though StackOverflow offer some amount help)

Reference:
- https://www.quora.com/What-are-the-main-weaknesses-of-Haskell-as-a-programming-language
- https://stackoverflow.com/questions/1786969/pitfalls-disadvantages-of-functional-programming

## Conclusion
So, Pineapple is like a language that wish to combine the readability of Python with the functional paradigm of Haskell.
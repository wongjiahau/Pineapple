# Pineapple language 
## Say goodbye to WTFs.
According to [codingsec.net](https://codingsec.net/2016/04/10-problems-every-programmer-face/), some of the top 10 problems every programmers have to faced are :

- Debugging
- Poor documentation
- People don't understand what I do
- Working with other people's code

Obviously, the problems above has already generated if not more than few billions of WTFs worldwide since the dawn of computers.

We realized that this is a serious problem, and thus we present to you: **Pineapple**, which is designed to reduced the WTFs of developers.  

P/S: The **W** in the WTF may stands for Why, When, What or How.

## What are the WTFs?
- WTF is this statement doing?
- WTF did my variable's value changed?
- WTF is this function about?
- WTF, which function modified my variables?
- WTF is the type of this variable?
- WTF is going on?
- HTF can I import function from another file?
- WTF, I just want to write a human-readable function but it seems impossible!

## Secondary objective
Despite reducing WTFs, Pineapple is also designed to allow *non-professional* to code *professionally* by leveraging functional concept such as `map` or `filter`.  

Before I continue, please try to understand the following code which are written in some programming language.
```Javascript
// Javascript
var goodApples = basketOfApples.filter((x) => x.isNotSpoilt())
```
```hs
-- Haskell
goodApples = filter (isNotSpoilt) basketOfApples
```
```python
# python
goodApples = [apple for apple in basketOfApples if apple.isNotSpoilt()]
```
*Don't worry if you don't fully understand them. Because they are not that really easy.*

Those codes above actually represent the following sentence.
```
Pick all apple that are not spoilt from a basket of apples.
```
Obviously, this sentence is not hard to understand, even a 3-year-old kid can understand it well.  

However, most programmer just can't express it properly in code because *syntax is the barrier* for expressing their thoughts.  

So, what I want to demonstrate here is that, **there are no stupid programmers, but there are syntax that make programmers look stupid.**

### Now, lets look at how Pineapple solve this syntax barrier issue.  
The following code is valid in Pineapple.
```java
// Pineapple
goodApples = select apple which isNotSpoilt from basketOfApples
```
Note that `select _ which _ from` are NOT keywords in Pineapple.   
They are signature of a function!  

Moreover, it's even shorter than the Python's version!

This is possible in Pineapple because it allow programmer to define `prefix`, `infix`, `postfix` or `hybrid` functions.  

So, that is how Pineapple allow **non-professionals to code professionaly**.


## Design goal
Pineapple  a general purpose language.
It is a language that focuses on (ranked by priority):
- **Every feature can be explained easily**
    - Can be easily understand by new learners
- **Computer should understand the user, not the other way round**
    - Can easily declare construct that is readable
- **Flexibility is more important than conceptual purity**
- **Debuggability is more important than elegantness**
- **Fail now is better than fail late**
- **Side effects are not good**
- **Every syntax should have one and only one purpose**
- **What you see is what you get (WYSIYG)**
- **Strong type safety**
    - A chicken can never be treated as a duck
    - This is to enhance the function of Intellisense and also reduce a lot of runtime errors
- **Easy module import/export**
    - This is to encourage the user to split their code into many tiny files, thus improving modularity
- **First class unit test**
    - This language should provide first class support for writing unit test
- **First class list operation**
    - This is to reduce a lot of uneeded for loop and increase readability
- **First class functions**
    - You can past functions to functions
- **Typability**
    - Most of the code should be easy to type 


## Language paradigm
- Functional
- Pseudo Object-Oriented

## Extra Design goal
- Any symbol or keywords in Pineapple should have **one and only one** meaning, in order to reduce confusion.
- The error thrown by the interpreter should be easy to understand
- REPL should be existence for this language
- Is an interpreted language
- Should give suggestion to user when there are ways to improve the code
- Highlight to user which lines of code are dirty (have side effects)

## Non-goal
- Super terse syntax (like Haskell or Python)
- Super verbose syntax (like Java)

## Influenced by
- Haskell
- Typescript
- CoffeeScript
- Python
- C#
- YAML
- PHP
- Java
- Eiffel
- Smalltalk

## Reference
- Quora: [Which programming language is/was the prettiest and/or most readable?](http://qr.ae/TUT8tw)


## The specifaction are located at [`specification`](https://github.com/wongjiahau/Pineapple/tree/master/specification) folder.
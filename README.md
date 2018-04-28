# Pineapple language 
## Say goodbye to WTFs.
Yes, `Pineapple` is designed to reduced the WTFs of developers.  
The **W** in the WTF may stands for Why, When, What, How.

## What are the WTFs?
- What is this statement doing?
- Why my variable's value change?
- What is this function about?
- Which function modified my variables?
- WTF is the type of this variable?
- WTF is going on?
- HTF can I import function from another file?
- WTF, I just want to write a human-readable function but it seems impossible!

## Design goal
Pineapple  a general purpose language.
It is a language that focuses on (ranked by priority):
- **Understandability**
    - Can be easily understand by new learners
- **Expressiveness**
    - Can easily declare construct that is readable
- **Strong type safety**
    - This is to enhance the function of Intellisense and also reduce a lot of runtime errors
- **Referential transparency**
    - This is to make sure most code written don't have side effects, thus the code will be easier to maintain and test
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

## Language paradigm
- Functional
- Pseudo Object-Oriented

## Extra Design goal
- The error thrown by the interpreter should be easy to understand
- REPL should be existence for this language
- Is an interpreted language
- Should give suggestion to user when there are ways to improve the code

## Non-goal
- Super terse syntax (like Haskell or Python)
- Super verbose syntax (like Java)

## The specifaction are located at [`specification`](https://github.com/wongjiahau/Pineapple/tree/master/specification) folder.

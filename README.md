# Pineapple language
Pineapple  a general purpose language.
It is a language that focuses on (ranked by priority):
- Understandability
    - Can be easily understand by new learners
- Expressiveness
    - Can easily declare construct that is readable
- Type safety
    - This is to enhance the function of Intellisense and also reduce a lot of runtime errors
- Referential transparency
    - This is to make sure most code written don't have side effects, thus the code will be easier to maintain and test
- Easy module import/export
    - This is to encourage the user to split their code into many tiny files, thus improving modularity
- First class list operation
    - This is to reduce a lot of uneeded for loop and increase readability
- High order function (map, filter, reduce)
    - Same as above
- Typability
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

## Language paradigm
- Functional
- Pseudo Object-Oriented

## Design goal
- The error thrown by the interpreter should be easy to understand
- REPL should be existence for this language
- Is an interpreted language
- Should give suggestion to user when there are ways to improve the code

## Non-goal
- Super terse syntax (like Haskell or Python)
- Super verbose syntax (like Java)

## The specifaction are located at [`specification`](https://github.com/wongjiahau/Pineapple/tree/master/specification) folder.

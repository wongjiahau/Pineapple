# Operators

## Introduction

Unlike most programming languages, Pineapple has only a few built-in operators:

|Name|Symbol|Usage|
|--|--|--|
|Assignment operator| `=`| For assigning value to variables|
|Arrow operator| `->`| To specify the return type of a function|
|Comma| `,` | To separate elements in a list|
|Question mark|`?`|To make a type nilable/nullable|

If you notice carefully, not even plus and minus are built-in operators, because you can define them!

!!! tip "Fun Fact"
    In Pineapple, operators are just functions that looks special.

In Pineapple, you can define two kinds of operator functions:

1. Prefix unary operator

2. Infix binary operator

The custom operator can be any symbols on the keyboard except for the built-in operators and brackets. Not only that, it can have variable length.

For examples, see the following table.

|Operator| Valid? | Reason |
|--|--|--|
|+| Yes | - |
|--|Yes| - |
|..|Yes|-|
|@|Yes|-|
|!@#|Yes|-|
|=|No|This is a built-in operator|
|.|No|This is a function name ([See here](./010-BasicFunctions.md))|
|`$  $`|No|Cannot have spaces|

---

## Prefix unary operator

Prefix means *in front*, unary means *single*. 

So, a prefix unary operator is an operator that will be placed *in front* of a *single* argument.

The code below is an example of defining a ==prefix minus operator==.

```pine
// Here's how you declare a prefix unary operator function
def - (this Number) -> Number
    pass

// Here's how you use it
let x = - 12
```

!!! info "Note"
    `#!pine pass` means that the implementation of the function is temporarily passed.  

    You can think of it as throwing `#!pine NotImplementedException`.  

    `#!pine pass` is used here because the main point here is about how to declare operator function, not about its internal details.

!!! tldr "How it works?"
    The code above will actually be translated into the following code(although not exactly):

    ```js
    // JavaScript
    let x = minus(12);
    ```

---

## Infix binary operator

Infix means *in between*, binary means *two*.

So, an infix binary operator is an operator that will be place *in between* *two* arguments.

The code below is an example of defining an ==infix exponent operator==.

```pine
// Here's how you define an infix binary operator
def (this Integer) ^ (that Integer) -> List{Number}
    pass

// Here's how you use it
let x = 2 ^ 3 
x.show // 8
```

!!! tip
    Infix binary operator is chainable, it means that the following code is valid in Pineapple.

    ```pine
    let x = 23 + 99 + 100 // No error!
    ```

---

## Precedence

The precedence rule in Pineapple is rather simplistic:

| Constructs | Precendence level (larger means higher) |
|--|--|
| Bracketized expression | 3 |
| Named functions | 2 |
| Operator functions | 1 |
| Keywords | 0 |

When both constructs with the same precedence appear at the same time, the ==most left one will be computed first==.

For example,

```pine
let x = 1 + 1 * 0 // Result is 0, because 1 + 1 will be computed first

let y = 2 + 4.square // Result is 18, because 4.square is computed first
```

Because of this, you don't have to memorize all those operator precedence rules anymore!

---

# Motivation
!!! tldr "What is this page about?"
    After reading this page, you will understand why Pineapple is born, and what kind of problems it aims to tackle. 

## Introduction

In any software project, the most expensive cost is actually not the development, but the maintenance, with some citing as high as 75% of the resources actually went into maintenance.[^1][^2][^3][^4]

According to the author of Clean Code, Uncle Bob, the main reason that causes software maintenance to be expensive is due to **poorly written code**.[^5]

Although the main culprit of dirty codes are programmers, I believe that the other reason might be due to the programming language itself.  

In fact, most programming languages such as Java, Python, Javascript, Ruby, C/C++ and PHP etc. have the following problem:

!!! note ""
    **Hard to write clean code.**

To write clean code in those languages, oftentimes you need to adhere to some military discipline or zen philosophy, or else you might shoot yourself in the foot.

So, this is why Pineapple is created, it is here to solve the *difficulties in writing clean code*. 

In other words, Pineapple is here to reduce the WTFs from developers.

![img](http://www.osnews.com/images/comics/wtfm.jpg)  

<hr>

## Factors that promoted dirty code

In summary, the primary factors that promoted dirty code are:

1. Hard to create understandable functions

2. Too many ways to create functions 

3. Hard to extend existing classes

4. Dynamic typing

5. Implicit mutability

!!! note
    Factor 4 and Factor 5 will not be discussed here as they are already discussed thoroughly by others. [^6][^7]

### Hard to create understandable functions

The main reason that prevented programmers to create understandble functions easily is that most programming languages still bares similarity with Assembly Code.

```py
# Assembly
MOV A, B

# Python
send(a, b)
```

From the code above, we can see that both Assembly and Python does not differ much. They both have the following characteristics:

- function name comes before arguments (a.k.a. prefix-oriented)

- arguments position are ambiguous 

- to understand what the function means, one usually have to lookup for its definition


==In short, it is unnatural.== Because we don't speak in such manner.

In general, all our instructive sentences have the following structure:

```xml
<subject> | <verb> | <object>  | <preposition> | <object>
```

For example:

```xml
<subject> | <verb> | <object>  | <preposition> | <object>
John,     | bring  | the apple | to            | kitchen.
```

There are several ways to emulate the sentence above in programming languages, but none of them are as clear and concise as the English sentence.

```py
# procedural
bring(john, apple, kitchen)

# object-oriented
john.bring(apple, kitchen)

# name parameters
bring(person=john, food=apple, destination=kitchen)
```

That's why sometimes, no matter how much you cook your brain juice, you just can't figure out a name that is good enough for your function.

#### Solution

The solution to this problem is ==mixfix function==. Mixfix means that the name of the function can be separated into many parts.  

For example:
```js
// Pineapple
john.bring(apple to kitchen)
```

In this case, the names of the function is `bring..to`. 

!!! info "Fun Facts"
    Some programming languages like Smalltalk and Agda actually had this feature.


[^1]: Glass, R.L., 2001. Frequently forgotten fundamental facts about software engineering. IEEE software, 18(3), pp.112-111.

[^2]: Lientz, B.P., Swanson, E.B. and Tompkins, G.E., 1978. Characteristics of application software maintenance. Communications of the ACM, 21(6), pp.466-471.

[^3]: Pearse, T., and Oman, P., 1995, October. Maintainability measurements on industrial source code maintenance activities. In Software Maintenance, 1995. Proceedings., International Conference on (pp. 295-303). IEEE.

[^4]: Galorath. 2017. [Accurately Estimate Your Software Maintenance Costs](http://galorath.com/software_maintenance_cost)

[^5]: Martin, R. C., 2009. Clean code: A handbook of agile software craftsmanship. Upper Saddle River, NJ: Prentice-Hall.

[^6]: Gros-Dubois, J. 2017. [Statically typed vs dynamically typed languages](https://hackernoon.com/statically-typed-vs-dynamically-typed-languages-e4778e1ca55)

[^7]: React.js Conf 2015. [Immutable Data and React](https://www.youtube.com/watch?v=I7IdS-PbEgI&feature=youtu.be)

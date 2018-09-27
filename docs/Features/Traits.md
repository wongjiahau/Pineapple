# Trait 

Trait is a feature that allows you to reduce code duplication.

## Why do we need trait?

Suppose we have two type of structure, which is `#!pine People` and `#!pine Fruit`,

```pine
def People
    :name    String
    :age     Number

def Fruit
    :name    String
    :size    Number
```

Then, suppose we have a list of `#!pine People` and a list of `#!pine Fruit`, and we wish to find out the maximum of each list.  

- For the `#!pine People` list, the maximum means the `#!pine People` with the largest `#!pine age`.  

- For the `#!pine Fruit` list, the maximum means the `#!pine Fruit` with the largest `#!pine size`.

To achieve that, we created two functions:

```pine hl_lines="5 14"
// Function for searching the max People in a People list
def (this List{People}).max -> People
    let mutable result = this.(0)
    for i in 1.to(this.length - 1)
        if this.(i):age > result:age
            result = this.(i)
    return result


// Function for searching the max Fruit in a Fruit list
def (this List{Fruit}).max -> Fruit
    let mutable result = this.(0)
    for i in 1.to(this.length - 1)
        if this.(i):size > result:size
            result = this.(i)
    return result
```

If you've notice carefully enough, the two functions only differs by one line, which is line 5 and line 14 (as highlighted in the code snippet above).  

This indicates **code duplication**, [which is bad and dangerous](https://stackoverflow.com/questions/2490884/why-is-copy-and-paste-of-code-dangerous). 

---

In general, there are two ways for solving the code duplicaiton problem:

1. Using lambdas (a.k.a first-class functions)

2. Using trait

### Using lambda

To understand why **trait** is necessary, let us first look at how lambda can solve the problem, as shown below.

```pine
// Declare the max function which takes a lambda/function
def (this List{T}).maxBy(comparer Function{Tuple{T, T} to Boolean}) -> T
    let mutable result = this.(0)
    for i in 1.to(this.length - 1) 
        if comparer.invoke((this.(i), result))
            result = this.(i)
    return result
```

To use the function above,

```pine
// suppose `peoples` is a variable that is declared
let maxPeople = peoples.maxBy(_:age > __:age) 
```

So, what's the problem with using lambdas?

1. Only people that understand lambdas understand the hackish looking code

2. Code maintainability is reduced (due to 1.)

3. Reusing the same function requires more typing (implying minor code duplication)

!!! info "Note"
    Despite the disadvantages described above, there are one major benefit of using lambdas, which is *flexibility*.  So, in a situation where *flexibility* is more favorable, you should use lambdas instead of traits.

---

### Using trait

In general, we need 4 steps to use trait:

1. Define a trait with some name
    - Usually, the name should be an adjective which ends with the **-able** suffix.

    - For example, Comparable, Eatable, Reversible etc.

2. Define a body-less function which uses the trait defined in step 1.

3. Define some non-body-less function which uses the trait defined in step 1.

4. Implement the required function needed by the traits for the data type we want 

The following code demonstrates how to use trait in Pineapple.

```pine
// First, define the trait
// Note that it is always in this format: 
//      def T is <TRAIT_NAME>
def T is Comparable


// Second, define a body-less function which uses the Comparable trait
// To achieve this, we need to use the `if` keyword
// This is like saying 
// we need to define a function for T called `.isMoreThan`
// if T is Comparable
def (this T).isMoreThan(that T) -> Boolean 
    if T is Comparable


// Thirdly, define the .max function which uses the Comparable trait
// We will use the `where` keyword here
def (this List{T}).max -> T
    where T is Comparable
    let mutable result = this.(0)
    for i in 1.to(this.length - 1)
        if this.(i).isMoreThan(result) // we can use the .isMoreThan function, because T is Comparable
            result = this.(i)
    return result
```

So, now we only left the last step. But, before that let's see what will happen if we missed out the last step:

```pine
let peoples = List{People}
let eldest = peoples.max 
// Error: `People` has not implemented the `Comparable` trait
```

We will get an error as described in line 3, because the `#!pine People` type have not implemented the function we defined in step 2.  And here's how we can implement it.

```pine
def (this People).isMoreThan(that People) -> Boolean
    // if People is Comparable <-- This line is not needed!
    return this:age > that:age
```

And we are done. 

So, if you ever need to use the `#!pine max` function on your custom data type, you just need to implement the `#!pine isMoreThan` function for your data type.

No more copy and paste!

--- 

## Differences with other languages

In fact, Pineapple's trait is a featured inpsired by Java/C#'s Interfaces, Haskell's Type Classes and Scala's Trait. 

However, there are one major differences that makes Pineapple's trait stands out:

==Using trait in Pineapple will not break existing code.==

Suppose we have a data type called `Animal` which is defined in a file named `Animal.XXX`, and a function named `isMoreThan` is also defined.

```java
// Language:  Java
// File name: Animal.java
public class Animal {
    public String name;
    public int weight;

    public boolean isHeavierThan(Animal other) {
        return this.weight > other.weight;
    }
}
```

```hs
-- Language:  Haskell
-- File name: Animal.hs
data Animal = Animal {
    name   :: String,
    weight :: Int
}

isHeavierThan :: Animal -> Animal -> Bool
isHeavierThan x y = (weight x) > (weight y)
```

```pine
// Language:  Pineapple
// File name: Animal.pine
def Animal
    :name    String
    :weight  Integer

def (this Animal).isHeavierThan(that Animal) -> Boolean
    return this:weight > that:weight
```

---


```pine
// Define a trait named Equatable
def T is Equatable

def (this T) == (that T) -> Boolean
    where T is Equatable
    pass

def (this T) != (that T) -> Boolean 
    where T is Equatable
    return (this == that).not

def T is Comparable extends T is Equatable

def (this T) > (that T) -> Boolean
    where T is Comparable
    pass

def (this T) < (that T) -> Boolean
    where T is Comparable
    return ((this > that).not).and((this == that).not)


def Color
    red     Number
    green   Number
    blue    Number

def (this Color) == (that Color) -> Boolean
    return  (this:red   == that:red  )
        .and(this:green == that:green)
        .and(this:blue  == that:blue )

// Now, you can use != on Color
```
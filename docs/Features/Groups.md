# Group 

Group is a feature that allows you to reduce code duplication by grouping different types into the same group.

## Why do we need group?

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

2. Using group

### Using lambda

To understand why **group** is necessary, let us first look at how lambda can solve the problem, as shown below.

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
    Despite the disadvantages described above, there are one major benefit of using lambdas, which is *flexibility*.  So, in a situation where *flexibility* is more favorable, you should use lambdas instead of groups.

---

### Using group

In general, we need 4 steps to use group:

1. Define a group with some name
    - Usually, the name should be an adjective which ends with the **-able** suffix.

    - For example, Comparable, Eatable, Reversible etc.

2. Define a body-less function which uses the group defined in step 1.

3. Define some non-body-less function which uses the group defined in step 1.

4. Implement the required function needed by the groups for the data type we want 

The following code demonstrates how to use group in Pineapple.

```pine
// First, define the group
// Note that it is always in this format: 
//      def group <GROUP_NAME>
def group Comparable


// Second, define a body-less function which uses the Comparable group
// To achieve this, we need to use the `if` keyword
// This is like saying 
// we need to define a function for T called `.isMoreThan`
// if T is Comparable
def (this T).isMoreThan(that T) -> Boolean 
    if T is Comparable


// Thirdly, define the .max function which uses the Comparable group
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
// Error: `People` has not implemented the `Comparable` group
```

We will get an error as described in line 3, because the `#!pine People` type have not implemented the function we defined in step 2.  And here's how we can implement it.

```pine
// Declare that People is under the Comparable group
def People is Comparable

// Implement the function needed by Comparable
def (this People).isMoreThan(that People) -> Boolean
    // if People is Comparable <-- This line is not needed!
    return this:age > that:age
```

And we are done. 

So, if you ever need to use the `#!pine max` function on your custom data type, you just need to implement the `#!pine isMoreThan` function for your data type.

No more copy and paste!

--- 

## Differences with other languages

In fact, Pineapple's group is a featured inpsired by Java/C#'s Interfaces, Haskell's Type Classes and Scala's Trait. 

However, there are one major differences that makes Pineapple's group stands out:

==Using group in Pineapple will not break existing code.==

Suppose we have a data type called `Animal` and a function named `isMoreThan`.

```java
// Language:  Java
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
data Animal = Animal {
    name   :: String,
    weight :: Int
}

isHeavierThan :: Animal -> Animal -> Bool
isHeavierThan x y = (weight x) > (weight y)
```

```pine
// Language:  Pineapple
def Animal
    :name    String
    :weight  Integer

def (this Animal).isHeavierThan(that Animal) -> Boolean
    return this:weight > that:weight
```

Imagine that during development, we suddenly realize we need a `Comparable` interface/typeclasses/trait for the `Animal` type. So, we coded it:

```java
// Java
public interface Comparable<T> {
    public boolean isHeavierThan(T other);
}
```

```hs
-- Haskell
class Comparable a where
    isHeavierThan :: a -> a -> Bool
```

```pine
// Pineapple
def group Comparable

def (this T).isHeavierThan(that T) -> Boolean
    if T is Comparable
```

However, to implement `Comparable` for `Animal` type, we need to modify the previous code as such (modification are those highlighted lines):

```java hl_lines="2"
// Language:  Java
public class Animal implements Comparable<Animal> {
    public String name;
    public int weight;

    public boolean isHeavierThan(Animal other) {
        return this.weight > other.weight;
    }
}
```

```hs hl_lines="7 8"
-- Language:  Haskell
data Animal = Animal {
    name   :: String,
    weight :: Int
}

instance Comparable Animal where
    isHeavierThan x y = (weight x) > (weight y)
```

But, no modification is needed in the Pineapple's code!

```pine
// Language:  Pineapple
def Animal
    :name    String
    :weight  Integer

def (this Animal).isHeavierThan(that Animal) -> Boolean
    return this:weight > that:weight
```

One advantages of such feature is that Pineapple allows an easier incremental design approach, where you do not need to think of the future too much.

---

## Other features

### group extension

You can extend a group by using the `extends` keyword. For example,

```pine hl_lines="11"
// Define a group named Equatable
def group Equatable

def (this T) == (that T) -> Boolean
    if T is Equatable

def (this T) != (that T) -> Boolean 
    where T is Equatable
    return (this == that).not

def T is Comparable extends T is Equatable

def (this T) > (that T) -> Boolean
    if T is Comparable

def (this T) < (that T) -> Boolean
    where T is Comparable
    return ((this > that).not).and((this == that).not)

```

### Using group in data structures

Another application of group is for creating generic data structure.  For example, a BinaryTree:

```pine
def BinaryTree{T} 
    where T is Comparable
    :current  T
    :left     BinaryTree{T}?
    :right    BinaryTree{T}?

def (this BinaryTree{T}?).insert(element T) -> BinaryTree{T}
    where T is Comparable

    if this == #nil
        this = BinaryTree{T}
            :current = element
            :left    = #nil
            :right   = #nil

    elif element >= this:current
        this:right = this:right.insert(element)

    elif element < this:current
        this:left = this:left.insert(element)

    return this
```

### Multiple type parameters group

To define a group with more than one type parameter, you need to use the following format:

```pine
def T1 is <group_NAME> T2
```

For example,

```pine
def T1 is ComparableTo T2

def (this T1) > (that T2) -> Boolean
    if T1 is ComparableTo T2
```
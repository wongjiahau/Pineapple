# Traits
This is like `typeclass` in Haskell. However note that it is difference from Scala `trait`.

## How to declare a trait?
Using the `@trait` keyword.

```
@trait
Equatable T
    T (==) T >> Boolean
    T (!=) T >> Boolean
```

## How to implement a trait?
Using the `@rule` keyword.
```
@blueprint
Fruit
    .name  : String
    .price : Rational

@rule
Fruit implement Equatable

@function
Fruit (==) Fruit >> Boolean
    return ($1.name  == $2.name )   \
       and ($1.price == $2.price)

@function
Fruit (!=) Fruit >> Boolean
    return not ($1 == $2)

@function 
insert $element:T into $tree:(BinaryTree of T) >> BinaryTree of T
```


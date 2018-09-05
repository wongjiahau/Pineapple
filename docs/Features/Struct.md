# Struct

## Introduction

Struct type is a collection of fields, it allows you to give more meaning to your data. In layman terms, you can imagine struct as mould.

To create a structure in Pineapple, you have to use the `def` keyword.  

!!! tip
    In Pineapple, every field name must starts with the colon `:` symbol.

For example,

```pine
def People
    :name   String
    :salary Number
```

!!! info "Note"
    `#!pine People` is the struct name, while `#!pine :name` and `#!pine :salary` is the field name.

To create new data from your struct, you have to use the struct name.

```pine
let john = People
    :name = "John"
    :salary = 999
```

Note that the indentation for each field is necessary.

To access the field data:

```pine
let x = john:name
```

<hr>

## Recursive struct

You can also create recursive struct which contain fields that points to itself.  

For example:

```pine
def People
    :name   String
    :friend People?
```

And here's how you create new data from it:

```pine
let john = People
    :name = "Marry"
    :friend = People
        :name = "Jane"
        :friend = People
            :name = "Lee"
            :friend = `nil
```

Accessing data:

```pine
let acquaintance = john:friend:friend
```

<hr>

## Generic struct

You can also create generic structure in Pineapple, this feature is important when you need to create custom data structures.  

Generic struct can help you to prevent some silly type error.

For example,

```pine
// here's how you declare a generic struct
def Node{T}
    :current T
    :next    Node{T}?

// here's how you use it
def .main
    let x = Node{Integer}
        :current = "10" // Error, should be Integer, not String
        :next    = `nil
```
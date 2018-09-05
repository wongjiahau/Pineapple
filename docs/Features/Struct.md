# Struct
Struct type is a collection of fields, it allows you to give more meaning to your data. In layman terms, you can imagine struct as mould.

To create a structure in Pineapple, you have to use the `def` keyword.  

Moreover, you have to remember that every field name must starts with colon `:`. 

For example,
```py
def People
    :name   String
    :salary Number
```
`People` is the struct name, while `:name` and `:salary` is the field name.

To create new data from your struct, you have to use the `new` keyword:
```
let john = new People
    :name = "John"
    :salary = 999
```
Note that the indentation for each field is necessary.

To access the field data:
```
let x = john:name
```
<hr>
## Recursive struct
You can also create recursive struct which contain fields that points to itself.  

For example:
```
def People
    :name   String
    :friend People?
```

And here:s how you create new data from it:
```js
let john = new People
    :name = "Marry"
    :friend = new People
        :name = "Jane"
        :friend = new People
            :name = "Lee"
            :friend = `nil
```
Accessing data:
```js
let acquaintance = john:friend:friend
```
<hr>

## Generic struct
You can also create generic structure in Pineapple, this feature is important when you need to create custom data structures.  

Generic struct can help you to prevent some silly type error.

For example:
```js
// here's how you declare a generic struct
def Node{T}
    :current T
    :next    Node{T}?

// here's how you use it
def .main
    let x = new Node{Integer}
        :current = "10" // Error, should be Integer, not String
        :next    = `nil
```
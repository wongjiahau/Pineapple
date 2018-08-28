# Struct
Struct type is a collection of fields, it allows you to give more meaning to your data. In layman terms, you can imagine struct as mould.

To create a structure in Pineapple, you have to use the `def` keyword.  

Moreover, you have to remember that every field name must starts with single-quote `'`. 

For example,
```py
def People
    'name   String
    'salary Number
```
`People` is the struct name, while `'name` and `'salary` is the field name.

To create new data from your struct, you have to do it like this:
```
let john = People
    'name = "John"
    'salary = 999
```
Note that the indentation for each field is necessary.

To access the field data:
```
let x = john'name
```


## Recursive struct
You can also create recursive struct which contain fields that points to itself.  

For example:
```
def People
    'name   String
    'friend People?
```

And here's how you create new data from it:
```
let john = People
    'name = "Marry"
    'friend = People
        'name = "Jane"
        'friend = People
            'name = "Lee"
            'friend = `nil
```
Accessing data:
```
let acquaintance = john'friend'friend
```


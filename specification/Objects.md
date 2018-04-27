# Objects
## PON (Pineapple Object Notation)
The data structure will be using the format of PON (Pinapple Object Notation). It is just a variant of JSON that is more readable with lesser typing.

Not only it is easier to read, it is also easier to retrieve the value of the desired node.

```java
// Pineapple 
myFruit =
    .name    = "Mango" 
    .isTasty = true
    .sibling =
        .name    = "Durian"
        .isTasty = false
    .amount  = (10 + 5)
```

The object declaration above is same as the following as in Javascript.
```js
// Javascript
myFruit = {
    name    : "Mango" 
    isTasty : true
    sibling : {
        name    : "Durian"
        isTasty : false
    }
    amount  : (10 + 5)
};
```

## How to access the data?
Using the dot notation, just like in Javascript.
```js
myFruit = 
    .name = "Durian"
    .price = 100
    .sibiling =
        .name = "Rambutan"

-- print myFruit.sibling.name
```

Note that the indentation is necessary.

However, you may also declared it in one line using curly braces.

So, you may also declare them in one line. 
```ts
// pineapple
myFruit ={.name="Mango" .isTasty=true .sibling={.name="Durian" .isTasty=false .sibling=null}}

// javascript
myFruit ={name: "Mango", isTasty=true, sibling: {name: "Durian", isTasty: false, sibling: null}}
```


## How to declare an empty object?
```js
var x = {}
```

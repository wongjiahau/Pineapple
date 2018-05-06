# Objects
## PON (Pineapple Object Notation)
The data structure will be using the format of PON (Pinapple Object Notation). It is just a variant of JSON that is more readable with lesser typing.

Not only it is easier to read, it is also easier to retrieve the value of the desired node.

```java
// Pineapple 
let myFruit =
    .name    = "Mango" 
    .isTasty = true
    .sibling =
        .name    = "Durian"
        .isTasty = false
    .amount  = (10 + 5)
```
Note that the **indentation is necessary**.

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
Using the dot notation or dot-bracket notation.
```js
let myFruit = 
    .name = "Durian"
    .price = 100
    .sibiling =
        .name = "Rambutan"

// Using dot notation
myFruit.sibling.name  // Rambutan

// Using String
myFruit.("sibling").("name") // Rambutan
```


However, you may also declared it in one line using curly braces.

So, you may also declare them in one line. 
```ts
// pineapple
let myFruit ={.name="Mango" .sibling={.name="Durian" .isTasty=false}}

// javascript
myFruit ={name: "Mango", sibling: {name: "Durian", isTasty: false}}
```


## How to declare an empty object?
```js
var x = {}
```
## Serialization
PON object can be serialized easily, just like JSON. Moreover, it is even more compact than JSON, because the property name do not have to be quoted (like JSON5);
```js
// JSON
jsonString  = '{"name":"pineapple","price":12.9,"date":"20180909"}' // 51 characters

// PON
ponString   = "{.name='pineapple'.price=12.9.date='20180909'}"      // 46 characters

// JSON5
json5String = '{name:"pineapple",price:12.9,date:"20180909"}'       // 45 characters
```
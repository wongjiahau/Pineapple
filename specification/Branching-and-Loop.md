# Branching and Loop
## Boolean expressions (BE)
Before we talk about `if` statement, we need to understand Boolean expression in Pineapple.  

### Basic boolean expressions
The most basic BE is `true` or `false`.

### Calling boolean function
In Pineapple, to call a boolean function, you need to use the `is` or `isnt` keyword.

## Chaining boolean expression
You can chain a boolean expression using `and` or `or` keyword.

There are 3 situations:
- Chaining boolean functions that refers to the same expression
    - *expr* (is|isnt) *boolFunc* [(and|or) (is|isnt) *boolFunc*]
    - Example: `score is > 70 and is <= 80`
- Chaining expressions that refers to the same boolean functions
    - *expr1* [ (and|or) *expr2* ] (is|isnt) *boolFunc*
    - Example: `myFruit or hisFruit isnt sweet`
- Chaining that refers to different expression
    - *expr1* (is|isnt) *boolFunc1* [(and|or) *expr2* (is|isnt) *boolFunc2*]
    - Example: `John is nice and Mary is sweet`


Note: 
- You cannot mix different situations together.
- You cannot use `and` with `or` at the same statement
    - Because you can always split the condition using `elif`

Wait. Why is `>70` a boolean function?  Due to [currying]( https://stackoverflow.com/questions/36314/what-is-currying).

Let's look at it's type.
```js
print: (>).type    // (left:Comparable, right:Comparable) >> Boolean
print: (> 70).type // left:Comparable >> Boolean
```


    
## If statements
It will be similar to Python.  
However, it must be in the form of:
- `if` *boolean expression* 

For example,
```js
let x = 5

if x is == 5
    print: `x is equal to 5`

if x isnt :even
    print: `x is not even`
```
Note that `even` is a boolean function.

## If statements with logical chaining
```js
if score is > 70 and is <= 80
    print: `Good job!`

if myFruit or hisFruit isnt :sweet
    print: `Someone's fruit is not sweet`

if John is :nice and Mary is :sweet
    print: `Wow`
```
Note that `:sweet` and `:nice` is a boolean function.

It is the same as the following in Javascript:
```js
if (score > 70 && score <= 80) {
    alert(`Good job!`);
}

if (!myFruit.isSweet() || !hisFruit.isSweet()) {
    alert(`Someone's fruit is not sweet`);
}

if (John.isNice() && Mary.isSweet()) {
    alert(`Wow`);
}
```

## If elif else
```js
if he is :nerdy 
    print: `He is a programmer.`
elif he is :hot
    print: `OMG`
else 
    print: `...`
```

## Loop
There are 2 type of loops:
- `for..in` loop
    - For iterating over items in list
- `while` loop
    - For other purposes
```ts
let fruits = [`apple`, `banana`, `pineapple`]

// Note that 1 to fruits.length will yield [1,2,3]
for i in 1 :to: fruits.length 
    print: fruits.{i}


for fruit in fruits
    print: fruit


let input @ String = ``
while input isnt == `exit`
    input << readLine:
    print: `Your input is ${input}`
```

## How to loop through keys of an object?
By using the `.pairs` property.
```ts
let myObject = 
    .first = `Pine`
    .last  = `Apple`
    .price = 99

print: myObject.pairs // [[`first`, `Pine`], [`last`, `Apple`], [`price`, 99]]

print: myObject.pairs.type // [String, Any][]

for key,value in myObject.pairs
    print: key
    print: value
```

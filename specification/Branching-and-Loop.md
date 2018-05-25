# Branching and Loop
## Boolean expressions (BE)
Before we talk about `if` statement, we need to understand Boolean expression in Pineapple.  

### Basic boolean expressions
The most basic BE is `true` or `false`.

### Calling boolean function
In Pineapple, to call a boolean function, you need to use the `is` or `not` keyword.

## Chaining boolean expression
You can chain a boolean expression using `and` or `or` keyword.

There are 3 situations:
- Chaining boolean functions that refers to the same expression
    - *expr* (is|not) *boolFunc* [(and|or) (is|not) *boolFunc*]
    - Example: `score is > 70 and is <= 80`
- Chaining expressions that refers to the same boolean functions
    - *expr1* [ (and|or) *expr2* ] (is|not) *boolFunc*
    - Example: `myFruit or hisFruit not sweet`
- Chaining that refers to different expression
    - *expr1* (is|not) *boolFunc1* [(and|or) *expr2* (is|not) *boolFunc2*]
    - Example: `John is nice and Mary is sweet`


Note: 
- You cannot mix different situations together.
- You cannot use `and` with `or` at the same statement
    - Because you can always split the condition using `elif`

Wait. Why is `>70` a boolean function?  Due to [currying]( https://stackoverflow.com/questions/36314/what-is-currying).

Let's look at it's type.
```js
print (>).type    // (left:Comparable, right:Comparable) -> Bool
print (> 70).type // left:Comparable -> Bool
```


    
## If statements
It will be similar to Python.  
However, it must be in the form of:
- `if` *boolean expression* 

For example,
```js
let x = 5

if x is == 5
    print `x is equal to 5`

if x not even
    print `x is not even`
```
Note that `even` is a boolean function.

## If statements with logical chaining
```js
if score is > 70 and is <= 80
    print `Good job!`

if myFruit or hisFruit not sweet
    print `Someone's fruit is not sweet`

if John is nice and Mary is sweet
    print `Wow`
```

## If elif else
```js
if he is nerdy 
    print `He is a programmer.`
elif he is hot
    print `OMG`
else 
    print `...`
```

## If else as expression (pending)
```js
let x = 5
let isMoreThan4 = true if x is > 5 else false
```

## Switch cases (pending)
Switch cases can be done using `switch`, `when`, and `otherwise` keyword.  

Its even more powerful that you can use the `it` keyword.


```js
let day = 1

switch day 
    when it is between 1 and 5
        print `Go to work`
    when it is == 6
        print `Go shopping`
    otherwise
        print `Relax`
```
You can have fall through statement.
```js
let fruit = `Pineapple`
switch fruit
    when `apple` 
    when `banana`
        print `Dont eat!`
    when `Pineapple`
        // Eat it!
```

Switch statement can also be used to return a value.
```coffee
let score = 77
grade = switch score
  when it is < 60 -> 'F'
  when it is < 70 -> 'D'
  when it is < 80 -> 'C'
  when it is < 90 -> 'B'
  otherwise       -> 'A'
```


## Loop
There are 2 type of loops:
- `for..in` loop
    - For iterating over items in list
- `repeat..times` loop
    - For other purposes
```ts
let fruits = [`apple`, `banana`, `pineapple`]

// Note that 1 to fruits.length will yield [1,2,3]
for i in 1 to fruits.length 
    print fruits.(i)


for fruit in fruits
    print fruit


let i <- 1
repeat fruits.length times
    print fruits.(i)
    i <- i + 1

// Infinite loop
repeat
    let input = readLine
    if input is == `exit` 
        break // Exit the loop
    print input
```

### How to loop through keys of an object?
By using the `.pairs` property.
```ts
let myObject = 
    .first = "Pine"
    .last  = "Apple"
    .price = 99

print myObject.pairs // [["first", "Pine"], ["last", "Apple"], ["price", 99]]

print myObject.pairs.type // [String, Any][]

for key, value in myObject.pairs
    print key
    print value
```

# Branching and Loop
## If statements
It will be similar to Python.  
However, it must be in the form of:
- `if` *expression* `is` *boolean function*
- `if` *expression* `not` *boolean function*

For example,
```js
let x = 5

if x is == 5
    print `x is equal to 5`

if x not even
    print `x is not even`
```
Note that `even` is a boolean function.

## If elif else
```js
if he is nerdy 
    print `He is a programmer.`
elif he is hot
    print `OMG`
else 
    print `...`
```

## Logical chaining
You can chain a condition using `and` or `or` keyword.

There are 2 situations:
- Chaining function that refers to the same expression
    - `if` *expression* (`is`|`not`) *boolean function* [(`and`|`or`) *boolean function*]
- Chaining function that refers to different expression
    - `if` *expr1* (`is`|`not`) *boolean function* [(`and`|`or`) *expr2* (`is`|`not`) *boolean function*]

Note: 
- You cannot mix 2 situation together.
- You cannot use `and` with `or` at the same statement
    - Because you can always split the condition using `elif`

For example,
```js
// Chaining function that refers to the same expression
if score is > 70 and <= 75
    print `Your grade is B+`

// Chaining function that refers to the different expressions
if john is crazy or james is crazy
    print `Someone is crazy`

// The following is invalid as it uses `and` with `or` together
if something is > 5 and < 9 or even
    print `What a weird number`

// The following is also invalid as it mix the 2 situations together
if pineapple is tasty and sour and apple is sweet
    print `I don't really understand`
```

## If else as expression (pending)
```python
let x = 5
let isMoreThan4 = true if x > 5 else False
```

## Switch cases (pending)
Switch cases can be done using `switch`, `when`, and `otherwise` keyword.  

Its even more powerful that you can use the `it` keyword.


```coffee
day = 1
switch day
    when it isBetween 1 and 5
        # Go to work
    when it == 6
        # Go shopping
    otherwise
        # Relax
```
You can have fall through statement.
```coffee
fruit = "Pineapple"
switch fruit
    when it == "apple" 
    when it == "banana"
        # Don't eat
    when it == "Pineapple"
        # Eat it!
```

Switch statement can also be used to return a value.
```Coffee
score = 77
grade = switch score
  when it < 60 then 'F'
  when it < 70 then 'D'
  when it < 80 then 'C'
  when it < 90 then 'B'
  otherwise 'A'
```


## Loop
There are 2 type of loops:
- `for..in` loop
    - For iterating over items in list
- `repeat..times` loop
    - For other purposes
```ts
let fruits = ['apple', 'banana', 'pineapple']

for i in 1 to fruits.length
    print fruits.(i)


for fruit in fruits
    print fruit


let i <- 1
repeat fruits.length times
    print fruits.(i)
    i <- i + 1

// Infinite loop
repeat -1 times
    let input = wait readLine
    if input == "exit" 
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

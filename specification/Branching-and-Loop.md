# Branching and Loop
It will be like python style.

## If elif else
```python
if (he is _smart) and (he is _nerdy)
    print "He is a programmer."
elif he is _hot
    print "OMG"
else 
    print "..."
```

## If else as expression
```python
let x = 5
leet isMoreThan4 = true if x > 5 else False
```

## Switch cases
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
```ts
let fruits = ['apple', 'banana', 'pineapple']

for i in 1 to fruits.length
    print fruits.(i)


for fruit in fruits
    print fruit


let i <- 0
repeat fruits.length times
    print fruits.(i)
    i <- i + 1

// Infinite loop
repeat -1 times
    let input = await readLine
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

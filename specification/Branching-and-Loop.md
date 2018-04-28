# Branching and Loop
It will be like python style.

## If elif else
```python
if he isSmart  and  he isNerdy
    print "He is a programmer."
elif he isHot
    print "OMG"
else 
    print "..."
```

## If else as expression
```python
var x = 5
isMoreThan4 = true if x > 5 else false


addMore = true
x += 5 if addMore
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
    when it is "apple" 
    when it is "banana"
        # Don't eat
    when it is "Pineapple"
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
```python
fruits = ['apple', 'banana', 'pineapple']

foreach i in [0 to (fruits length - 1)]
    -> print fruits[i]


foreach fruit in fruits
    -> print fruit

var i = 0
while i < fruits length
    -> print fruits[i]
    i++
```

### How to loop through keys of an object?
By using the `keysOf` function.
```python
foreach key in keysOf myObject
    -> print myObject[key]
```

## Try catch
```coffee
try
    -> doSomeCrazyThing
catch error
    -> print (error toString)
finally
    -> cleanUp
```
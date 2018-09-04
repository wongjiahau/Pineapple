# Control Flow Statements
Basically, you can control the flow of your Pineapple code with any of the following:

- `if` , `elif` and `else`

- `for` loop

- `while` loop

- `break` , `continue` or `return`

## If-elif-else statements
Similar to Python, all you need is indentation (tab), you don't need those curly brackets.
For example:
```py
if he.isCrazy
    you.callAmbulance
elif he.isInDanger
    you.goHelp(he)
else
    you.doNothing
```
Note that every test expression must be Boolean type.  

Remember that `.isCrazy` and other similar construct are just [functions](BasicFunctions.md).
<hr>

## Test expression chaining
Sometimes, a single test expression is not enough to express what you really wanted.  In such situation, you can use the following logical operators:

- `and`

- `or`

- `not`

For example:

```py
if he.isYoung and he.isNaughty
    "He is a kid".show

elif sky.isBlue or air.isFresh
    "I am happy!".show

elif not current.isLunchTime
    "Continue working . . .".show
```

#### Note
`not` operator have higher precedence than `or` and `and`.  
For example, the following code:
```py
if not he.isFine and he.isEating
    ...
```

Is same as:

```py
if (not he.isFine) and he.isEating
    ...
```



<hr>

## For statements

For statements is used to iterate over a list.  
For example:
```py
for x in [1,2,3,4]
    x.show
```

<hr>

## While loop

While loop is use to loop some code until certain condition is met.
```py
while not file.atEOF
    file.readline.show
```
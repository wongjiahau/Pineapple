# Control Flow Statements
Basically, you can control the flow of your Pineapple code with any of the following:

- `#!pine if` , `#!pine elif` and `#!pine else`

- `#!pine for` loop

- `#!pine while` loop

- `#!pine break` , `#!pine continue` or `#!pine return`

## If-elif-else statements

Similar to Python, all you need is indentation (tab), you don't need those curly brackets.
For example:

```pine
if he.isCrazy
    you.callAmbulance

elif he.isInDanger
    you.goHelp(he)

else
    you.doNothing
```

!!! note "Note"
    Every test expression must have type of Boolean.

!!! tip "Tips"
    `#!pine .isCrazy` and other similar construct are just [functions](./010-BasicFunctions.md).

<hr>

## Test expression chaining

Sometimes, a single test expression is not enough to express what you really wanted.  In such situation, you can use the following functions:

- `#!pine .and`

- `#!pine .or`

- `#!pine .not`

For example:

```pine
if he.isYoung.and(he.isNaughty)
    "He is a kid".show

elif sky.isBlue.or(air.isFresh)
    "I am happy!".show

elif current.isLunchTime.not
    "Continue working . . .".show
```

<hr>

## For statements

For statements is used to iterate over a list.  
For example:

```pine
for x in [1,2,3,4]
    x.show
```

<hr>

## While loop

While loop is use to loop some code until certain condition is met.

```pine
while not file.atEOF
    file.readline.show
```
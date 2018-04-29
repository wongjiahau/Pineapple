# Variables
## Binding 
In Pineapple, the equal symbol ( `=` ) does not stands for assignment, however it stands for binding. And once you bind a name with a value, you cannot rebind it again.
```python
x = 4
x = 5 # Error: `x` is already binded to the value `4`

people = {.name="John"}

people.name = "Ali" # Error: `people.name` is already binded to the value "John"
```
## Assignment
You can declare a variable by using the left arrow operator (`<-` ).
```python
x <- 5
x <- 6 # No error

people = {.name <- "John"}
people.name = "Ali" # No error
```

## Why we need to separate the concept of binding with assignment?
This is to reduce one of the WTFs, which is **WTF did my variable's value changed?**

This will allow programmer to debug their code easily.  

For example, let say we have a `type`.
```java
@type
Fruit:
    .name  : string
    .price : number
```
Then, we have a function that will modify the price of a `Fruit` to 99.
```java
@function
changePriceOf (fruit:Fruit) => void
    fruit.price <- 99
```
Now, let say in our main program we created a new `Fruit` object.
```java
myFruit: Fruit =
    .name  = 'Pineapple'
    .price = 88
```
Let's try to call the `changePriceOf` function.
```python
changePriceOf myFruit # Compile error
```
The statement above will result in compile error, because we already binded the value `88` to `myFruit.price`.  

So, how can we fix this?  

Easy, just by changing the binding operator (`=`) to assignment operator (`<-`) .
```python
myFruit: Fruit =
    .name   = 'Pineapple'
    .price <- 88

changePriceOf myFruit # No error
```
But, you may ask *'How can this idea help me to debug my code?'*.  
The answer is simple,  **just look for the `<-` symbol** !  
Because all the unexpected things happen when we change the value of a variable.


## How to specify type?
You can also specify type when declaring a variable by using colon (`:`) . It's just like Typescript.
```
x: number = 2
y: number = "123" # Error
```

## Naming Rules
- All variable names must consist of only alphanumeric characters and `$` sign.
- A variable name must not start with a number. 
- A variable name cannot contain any symbol other than `$`.

Thus, the only naming convention allowed is `camelCase`.   
All other naming convention such as `snake_case` or `kebab-case` are forbidden.

### Example

|Variable Name|Valid or not|  
|--|--|  
|x|valid|  
|$|valid|  
|hello_there|Invalid, cannot contain underscore ( `_` ) |  
|12ve|Invalid, cannot start with number
|goodBye|Valid
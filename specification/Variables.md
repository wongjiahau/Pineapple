# Variables
## Declaration and assignment
Variable can be declared directly without any keyword. However, by default they are immutable, means you cannot reassigned to them.
```python
x = 4
x = 5 # Compile error

people = .name="John"

people.name = "Ali" # Compile error
```

However, if you want a variable to be mutable, you do that by using `var` keyword.
```python
var x = 4
x = 5 # No error

var people = .name="John"
people.name = "Ali" # No error
```

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
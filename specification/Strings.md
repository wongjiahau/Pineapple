# Strings
Strings are delimited by backticks.  
Double quotes or quotes is not allowed (to reduce confusion on which one to use).

The reason why backtick is chosen is because sometimes you need to put single-quote or double-quote inside the interpolated string.

For example:
```js
let fruit1 = `pineapple` // valid
let fruit2 = "pineapple" // invalid
let fruit3 = 'pineapple' // invalid
```

## String interpolation
You can interpolate expression into String using curly brackets `${}` and backtick quote (like Javascript).

```js
let chosenFruit = `durian`
let message1 = `I like ${chosenFruit}` // I like durian 
let message2 = `The value of pi is ${22/7}` 
// The value of pi is 3.142
```

## Multiline String
It's the same as interpolated string.
```js
let html = 
`
    <div>
        <span>I like pineapple!</span>
    </div>
`
```

## Comments
Single line comment is prefix by `//`.
```js
// This  is a comment

let x = 3 // You can place it at the back
```

Multiline comment is using `/**/`.
```js
let x = 5
/*
This is a 
multiline 
comment
*/
```


## Regex
Regex are first class just like Javascript. They are enquoted using `/` .
```js
let phoneNumberPattern = /^[0-9]{3}-\d{7}$/

if `012-34567` match phoneNumberPattern
    print `oh yea`
else
    print `oh no`
```

## Custom literals
You can create custom literals in Pineapple using the `@literal` annotation and `@metafunction` annotation.
For example, let us create a binary literal.
```js
@literal
bin >> Int

@metafunction
validate str:Literal<bin> >> String | nil
    if str not (match /^[01]+$/)
        >> `Must consist of one and zeroes only`
    else
        >> nil

@metafunction
convert str:Literal<bin> >> Int
    let result << 0
    for i in 1 to str.length
        let char = str.(i)
        result << result + ((parse char asInt) * (2 ** (i - 1)))
    >> result

// How to use it?
let myNumber = bin`0110110`
let invalid = bin`0123` // Compile error: `Must consist of one and zeroes only`
```
Why use literals? Because literals can help you spot error during compile time.

### Let's look at another example for complex number.

First, we need to define the Complex type.
```js
@type
Complex:
    .real: Number
    .imaginary: Number
```

Then, we define a literal for it.
```js
@literal
c >> Complex

validate str:Literal<c> >> String | nil
    if str not match /^[+-]?\d+([.]\d+)?[+-]\d+([.]\d+)?[ij]$/
        >> `Invalid format for complex number`
    else
        >> nil

@metafunction
convert str:Literal<c> >> Complex
    let tokens = split str by /[+-]/
    let real = parse tokens.(1) asNumber
    let imaginery << parse tokens.(2) asNumber
    if (from str capture /[+-]/).(1) is == `-`
        imaginery << -imaginery
    >> 
        .real = real
        .imaginery = imaginery
    
// Example usage
let x = c`99.2-0.8j` // valid
let y = c`99` // Error: `Invalid format for complex number`

print x.imaginery // -0.8


```
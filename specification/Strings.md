# Strings
Like Javascript, Strings can be delimited by the `"` or `'` characters.
```ts
let fruit = "pineapple"
let message = 'hello'
```

## String interpolation
You can interpolate expression into String using curly brackets `${}` and backtick quote (like Javascript).

The reason why backtick is chosen is because sometimes you need to put single-quote or double-quote inside the interpolated string.
```js
let chosenFruit = "durian"
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
Single line comment is prefix by `#` or `//`
```php
# This is a comment
let x = 3 # You can place it at the back
// This  is also a comment
```

Multiline comment is surrounded by `###`.
```coffee
###
This is a 
multiline 
comment
###
```

## Regex
Regex are first class just like Javascript. They are enquoted using `/` .
```js
let phoneNumberPattern = /^[0-9]{3}-\d{7}$/

if "012-34567" matches phoneNumberPattern
    print "oh yea"
else
    print "oh no"
```

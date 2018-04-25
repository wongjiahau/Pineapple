# Strings
Like Javascript, strings can be delimited by the `"` or `'` characters.
```ts
let fruit = "pineapple"
let message = 'hello'
```

## String interpolation
String interpolation are same as in C#. Just prefix the string with a dollar sign (`$`). 
It will works for both double quote (`"`) and single quote (`'`).
```cs
let chosenFruit = "durian"
let message1 = $"I like {chosenFruit}" 
let message2 = $'The value of pi is {22/7}' 
```

## Multiline string
No extra syntax, just like PHP.
```php
let html = 
"
    <div>
        <span>I like pineapple!</span>
    </div>
"
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
Regex are first class just like Javascript. They are enquoted using `/`.
```js
phoneNumberPattern = /^[0-9]{3}-\d{7}$/

if "012-34567" conformsTo phoneNumberPattern
    -> print "oh yea"
else
    -> print "oh no"
```

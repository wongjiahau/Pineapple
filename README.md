# Pineapple language
This is a language that focuses on:
- Readability
- Typability
- Type safety
- High order function (map, filter, reduce)
- Ability to differentiate pure and impure code (like Haskell)
- Easy module import/export

This language aims to allow developers to write readable code easily and to write library that have readable API. 

Also, it focuses on typability, means weird symbols that are hard to type will be avoided as much as possible.

However, readability will be preferred first when contradicting situation happens.

## Influence by
- Haskell
- Typescript
- CoffeeScript
- Python
- C#
- YAML
- PHP

## Language paradigm
- Functional


## The specifaction are located at `specification` folder.

## Operators
### Arithmetic

|Symbol|Name|  
|-|-| 
|`+`|Plus
|`-`|Minus/Negate
|`*`|Multiply
|`/`|Divide
|`%`|Modulus

### Relational
|Symbol|Name
|-|-|  
| `> `  |More than
| `< `  |Less than
| `<=`  |Less than or equals
| `>=`  |More than or equals
| `==`  |Equals
| `!=`  |Not equals
| `! `  |Not

### Others

|Symbol|Name|
|-|-|  
|`~`|Function name linker
|`=`|Pure assignment|
|`<-`|Dirty assignment|
|`:`|Type scoping|
|`=>`|Return|
|`??`|Unimplemented
|`[]`|List initialization|


## Branching and loop
It will be like python style.
### If-else
```python
if he isSmart  and  he isNerdy
    print "He is a programmer."
elif he isHot
    print "OMG"
else 
    print "..."


```
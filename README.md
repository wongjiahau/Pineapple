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
- Python
- C#
- YAML

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

## Data structure
The data structure will be using the format of PON (Pinapple Object Notation)
```ts
// Definition
type Fruit:
.name       : string
.isTasy     : boolean
.sibling    : Fruit | null

// Initialization
let myFruit: Fruit = 
    .name    = "Mango" 
    .isTasty = true
    .sibling = 
        .name    = "Durian"
        .isTasty = false
        .sibling = null

print(myFruit.sibling.name) // "Durian"
```

You may also declare them in one line
```ts
let myFruit: Fruit = .name="Mango" .isTasty=true .sibling= .name="Durian" .isTasty=false .sibling=null 
```

You may also use bracket to group them together, but that is optional
```ts
let myFruit: Fruit =(.name="Mango" .isTasty=true .sibling=(.name="Durian" .isTasty=false .sibling=null))
```

## Functions
Note that the `??` operator means the function is unimplemented yet

### Prefix function
```
sum~(xs:number[]) => number 
    => ??


result = sum~[1,2,3,4]
```

### Suffix function
```ts
(howMany:int)~daysFromToday => Date 
    => ??

result = 5~daysFromToday
```

### Infix function
```
(x:boolean)~xor~(y:boolean) => number
    => ??

result = true~xor~false

```
### Hybrid funtion
```
expect~(x:number)~toEqual~(y:number) =>  maybe error 
    => ?? 

expect~99~toEqual~99
```
```
from~(list: T[])
    ~select~(function: T => T)
    ~where~(comparator: T => boolean) => T[]
    => ??

from~[1,2,3,4]
    ~select~((x) => x + 2)
    ~where~((x) => x > 2)
```
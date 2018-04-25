# Functions
Note that the `??` operator means the function is unimplemented yet

## Prefix function
```
sum (xs:number[]) => number 
    => ??

result = sum [1,2,3,4]
```

## Suffix function
```ts
(howMany:int) daysFromToday => Date 
    => ??

result = 5 daysFromToday
```

## Infix function
```ts
(x:boolean) xor (y:boolean) => number
    => ??

result = true xor false

```
## Hybrid funtion
```ts
expect (x:number) toEqual (y:number) =>  maybe error 
    => ?? 

expect 99 toEqual 88 // error
```

```
from (list: T[])
    select (function: T => T)
    where (comparator: T => boolean) => T[]
    => ??

from [1,2,3,4]
    select (x => x + 2)
    where (x => x > 4) 
// The result will be []
```

## Function precedence
```
Prefix > Suffix > Infix > Hybrid
```

## Referential transparency
All `IO` functions can only be called using arrow operator.
This is to allow the programmer to quickly identified which lines contain side effects.

Operators:  
- `<-` is used for getting input 
- `->` is used for giving output

```
name <- readLine
-> print "Hello"

name = readLine # Compiler error
print "Hey" # Compiler error
```

### How to declare function that involve IO?
```
# For function that contain output IO only
-> send (query: string) ToDatabase => void
    => ??

# For function that contain input IO only
<- readIc => string
    => ??

# For function that contain both
<-> readAndPrint => void
    => ??
```

If a function is not prefix with any arrow operator, it cannot contain statement that involve IO operation.
For example:
```
sayHello => void
    -> print "hello" # Compile error
```

## Void functions

Void function must be declared with `=> void`

```
-> sayHello => void
    print "Hello"
```

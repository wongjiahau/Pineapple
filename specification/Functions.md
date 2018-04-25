# Functions
Every function can be annotated with the `@function` keywords. This is optional, it is just to improve the readability.  
Note that the `??` operator means the function is unimplemented yet

## Prefix function
```ts
@function 
sum (xs:number[]) => number 
    => ??

result = sum [1,2,3,4]
```

## Suffix function
```ts
@function
(howMany:int) daysFromToday => Date 
    => ??

result = 5 daysFromToday
```

## Infix function
```ts
@function
(x:boolean) xor (y:boolean) => number
    => ??

result = true xor false

```
## Hybrid funtion
```ts
@function
expect (x:number) toEqual (y:number) =>  maybe error 
    => ?? 

expect 99 toEqual 88 // error
```

```ts
@function
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

### How to declare function that involve IO operation?
By using the `IO` keyword.
```ts
@function IO
send (query: string) ToDatabase => void
    => ??

```

If a function is not annotated with `IO`, it cannot contain statement that involve IO operation.
For example:
```ts
@function 
sayHello => null
    -> print "hello" # Compile error
```

## Void functions

Void function must be declared with `=> void`

```ts
@function IO
sayHello => void
    -> print "Hello"
```

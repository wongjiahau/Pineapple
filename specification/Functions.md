## Functions
Note that the `??` operator means the function is unimplemented yet

### Prefix function
```
sum (xs:number[]) => number 
    => ??

result = sum [1,2,3,4]
```

### Suffix function
```ts
(howMany:int) daysFromToday => Date 
    => ??

result = 5 daysFromToday
```

### Infix function
```ts
(x:boolean) xor (y:boolean) => number
    => ??

result = true xor false

```
### Hybrid funtion
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

### Function precedence
```
Prefix > Suffix > Infix > Hybrid
```
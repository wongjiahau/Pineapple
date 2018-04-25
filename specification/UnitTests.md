# Unit test
Unit testing is a first class facility in Pineapple, so coder can define test cases easily within the same file.

Moreover, they don't need install external library.

You can denote a test using `@test` annotation.

```java
@function
(x: number) divide (y: number) -> number | error
    if y == 0
        throw newError "Divisor cannot be zero"
    => y / x

@test _divide_
5 divide 2 shouldReturn 2
5 divide 0 shouldThrowError
```

Thus, the interpreter will also run the test when it interpret the code, and warn user when test case failed.
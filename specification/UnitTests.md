# Unit test (pending)
Unit testing is a first class facility in Pineapple, so coder can define test cases easily within the same file.

Moreover, they don't need install external library.

You can denote a test using `@test` annotation.

```java
@function
(dividend:Number) divide (divisor:Number) >> Number  
    if divisor == 0 throw "Divisor cannot be zero"
    >> y / x

@test _divide_
    @case 1
        (5 divide 2) shouldBe 2

    @case 2
        (try 2 divide 0) shouldBeError
```

Thus, the interpreter will also run the test when it interpret the code, and warn user when test case failed.
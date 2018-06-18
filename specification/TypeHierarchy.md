# Type Hierarchy
The Pineapple language type hierarchy will be desribed using YAML.
```yaml
MotherOfAllType // non-existent
    Void
    Nil
    Any
    Object
        String
            Regex
            Directory
        Number
            Double
            Float
            Rational
            Int
        Boolean
        List
        Type
        Function
        Error
```

## The Object type
```java
@blueprint
Object
    .type: Type
```

## The blueprint of Type
```
@blueprint
Type
    .parent: Type
```
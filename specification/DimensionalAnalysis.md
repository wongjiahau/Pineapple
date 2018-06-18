# Dimensional Analysis
Since Pineapple supports suffix and mixfix @functions, it is easy to create a dimensional analysis library.

## Base units
According to [this website](http://www.npl.co.uk/reference/measurement-units/si-base-units/)

The seven SI base units are:
- Ampere (A)
- Candela (cd)
- Kelvin (k)
- Kilogram (kg)
- metre (m)
- mole (mol)
- second (s)

Thus the blueprints shall be:
```
@blueprint
Dimension
    .ampere   :  Rational
    .candela  :  Rational
    .kelvin   :  Rational
    .kilogram :  Rational
    .metre    :  Rational
    .mole     :  Rational
    .second   :  Rational

@blueprint
Unit
    .value     : Double
    .dimension : Dimension
```
Then the operations:
```
@function
($x:Unit) + ($y:Unit) >> Unit
    makesure $x.dimension == $y.dimension
    return
        .value     = $x.value + $y.value
        .dimension = $x.dimension

@function
($x:Unit) - ($y:Unit) >> Unit
    makesure $x.dimension == $y.dimension
    return
        .value     = $x.value - $y.value
        .dimension = $x.dimension

@function
($x:Unit) * ($y:Unit) >> Unit
    return
        .value     = $x.value     * $y.value
        .dimension = $x.dimension * $y.dimension

@function
($x:Unit) / ($y:Unit) >> Unit
    return
        .value     = $x.value     / $y.value
        .dimension = $x.dimension / $y.dimension

@function
($x:Dimension) * ($y:Dimension) >> Dimension
    return
        .ampere   = $x.amperea  + $y.ampere
        .candela  = $x.candela  + $y.candela
        .kelvin   = $x.kelvin   + $y.kelvin
        .kilogram = $x.kilogram + $y.kilogram
        .metre    = $x.metre    + $y.metre
        .mole     = $x.mole     + $y.mole
        .second   = $x.second   + $y.second

@function
($x:Dimension) / ($y:Dimension) >> Dimension
    return
        .ampere   = $x.amperea  - $y.ampere
        .candela  = $x.candela  - $y.candela
        .kelvin   = $x.kelvin   - $y.kelvin
        .kilogram = $x.kilogram - $y.kilogram
        .metre    = $x.metre    - $y.metre
        .mole     = $x.mole     - $y.mole
        .second   = $x.second   - $y.second
```

Functions for initializing a value:
```
@function
newUnit >> Unit
    return
        .value     = 0
        .dimension =
            .ampere   = 0
            .candela  = 0
            .kelvin   = 0
            .kilogram = 0
            .metre    = 0
            .mole     = 0
            .second   = 0

@function
($value:Double) kg >> Unit
    let $result = newUnit
    $result.value = $value
    $result.dimension.kilogram = 1
    return $result
```
Example of usage:
```
let $mass = 123 kg
```
# Module

!!! warning
    This document is currently a draft, it means it will change anytime.

## Importing code from other files

Suppose the following file structure:
```
- myFoler
    - math.pine
    - app.pine
```

```pine
// File math.pine
def (this Number).square -> Number
    pass

def (this Number).inverse -> Number
    pass
```

```pine
// File app.pine
import "./math.pine"

def .main 
    let x = 2.square
```

Every function defined in `math.pine` is now exposed in `app.pine`.

!!! info "Note"
    If A imported B, and B imported C, the declarations from C will not be exposed in A.

## Importing code from Github

You must specify the version.

```pine
import "github.com/wongjiahau/yaml/v2.0.0"

```
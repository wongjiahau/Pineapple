# Structure of Pineapple program
Basically, all Pineapple program are lists of definitions.  
The definitions are:  

- Function definition  

- Struct definition  

- Import definition

- Constants definition

- Type aliases definition

- Trait declaration definition

- Trait implementation definition

- Enumeration definition  

For example:

```pine
// function definition
def .main
    "Hello world".show

// struct definition
def People
    :name String
    :age  Number

// import definition
import "./myFunctions.pine"

// constants definition
def pi = 3.142

// type aliases definition
def Color = Tuple{Int,Int,Int}

// trait declaration definition
def Equatable{T}
    def (this T) == (that T) -> Bool
    def (this T) != (that T) -> Bool
        return not this == that

// trait implementation definition
def Equatable{Color}
    def (this Color) == (that Color) -> Bool
        return \
            this.(0) == that.(0) and \
            this.(1) == that.(1) and \
            this.(2) == that.(2)

// enumeration definition
def Color
    `red
    `green
    `blue
    `yellow

```
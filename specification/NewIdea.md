```smalltalk
// Some ideas 

// main function should be labelled with --entry 
--entry
	print: "hello"
	print: "hey yo"

// Multiline array
let animals as String[]  = 
	o 'chicken'
	o 'duck'
	o 'elepehant'
	o 'dog'
	o 'cat'

// Array of objects
let people as People[] = 
	o 	
		.name = "Wong"
		.age  = 3
	o	
		.name = "yo"
		.age  = 4
	
// Array access like F#
print: people.[1].name // "Wong"

// Array slicing  
people.[1..2]



// New function definition syntax inspired by Smalltalk syntax
--function 
start as Int to: end as Int >> Int[]
    if start == end 
		return [end]
	else
		return [start] ++ ((start - 1) to: end)

for i in 1 to: array.length 
	print: array.[i]

	
--function
print: message as String
	<javascript>
	console.log(message)
	</javascript>

	

--template
People
	.name as String
	.age  as Number
	.job	
		.name   as String
		.salary as String 


// Nofix
let x = pi:

// Prefix
let x = sum: [1 2 3]

// Infix
let x = 5 add: 2 add: 3

// Suffix
let x = 5 km:

// Mixfix
let x = split: "Hello world" by: " "


```


## Object Initialization
```
--template
Fruit
    .name    as String
    .sibling as Fruit?

let x = Fruit
    .name     = 'Pine'
    .sibling  = nil

let manyFruits = 
	o Fruit
		.name    = 'Pine'
		.sibling = Fruit
			.name    = 'Durian'
			.sibling = nil
	o Fruit
		.name    = 'Pine'
		.sibling = Fruit

let html = 
	View
	.children = 
		o View {.style = Style{.flex=1 .width=50 .height=50 .background='blue'}
		o View {.style = Style{.flex=2 .width=50 .height=50 .background='blue'}
		o View {.style = Style{.flex=3 .width=50 .height=50 .background='blue'}
```
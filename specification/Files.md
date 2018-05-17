# File
To read a file, you can use the utility function `open`.
## Reading
```js
let file = open ./myFile.txt in FileMode#Read
let allLines: String[] = await read file
```

## Writing
```js
let file = open ./myFile in Write::Mode
append "Hello" into file
```

## Smart directory
Since Pineapple supports the `Directory` type, it is easy to open a file without typing its name wrongly.  
Let say we are opening a file that does not exist.
```js
let fileStream = open ./myFile.txt // Error: File does not exist
```

## Directory globbing
Pineapple supports Bash-style directory globbing directly.
```
let allTextFiles: Directory[] = ./*.txt

print allTextFiles // [./file1.txt , ./file2.txt]

let allFiles: Directory[] = ./*
```
Refer [this document](http://tldp.org/LDP/abs/html/globbingref.html) for more info about globbing.
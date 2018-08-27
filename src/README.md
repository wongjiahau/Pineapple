# Pineapple Language
## 1. How to install?
```
npm install --global pineapple-alpha
```

## 2. How to use?
### 2.1 Create a file named `hello.pine` with the following content.
```scala
def .main
    "Hello world".show
```

### 2.2 Run the Pineapple interpreter
```
pine hello.pine
```


# How to get started (For developers)
## 1.1 You need to install `jison` parser generator.
```
npm i -g jison --save
```

## 1.2 You also need `tsc`, Typescript Compiler
```
npm i -g typescript --save
```

## 2. Generate the parser
```
cd ./src/jison
jison pineapple-parser-v2.jison
```

## 3. Run the typescript transipler 
```
cd src/ts
./transpile
```

## 4. To run the interpreter
```sh
cd src/js
node interpreter.js hi.pine
```

Note that `hi.pine` is just a file name.

## 5. How to run test?
```
cd src
jest --watch
```

## 6. How to build C++ binding code?
```
cd src
npm install
```

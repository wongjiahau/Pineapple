# How to get started
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

## 3. Run the typescript transipler for REPL
```
cd src
cd './ts/'
./transpile
```

## 4. To run the interpreter
```sh
cd src/js
node interpreter.js hi.pine
```
Note that `hi.pine` is just a file name.

## 5. How to build C++ binding code?
```
cd src
npm install
```
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
jison ./pineapple-parser.jison
```

## 3. Run the typescript transipler for REPL
```
cd src
cd './ts/'
tsc --watch
```

## 4. Run the REPL to test the parser
```
cd src
node './js/repl.js'
```
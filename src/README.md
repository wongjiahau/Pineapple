# Pineapple Language
## 1. How to install?
```
sudo npm install -g pineapple-alpha --unsafe-perm=true
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
npm i -g jison
```

## 1.2 You also need `tsc`, Typescript Compiler
```
npm i -g typescript
```

## 1.3 Also, TSLint
```
npm i -g tslint 
```

## 1.4 Lastly, install needed modules
```
cd src
npm install
```

## 2. Generate the parser
```
./genparser.sh
```

## 3. Run the typescript transipler 
```
./build.sh
```
To run the transpiler without watching file changes, and also TSLint check:
```
./build.sh 0
```

## 3.1 How to run TSLint
```
cd src/ts
tslint --project ./ --fix
```
The command above will run TSLint on the `src/ts` folder, and also fix any fixable warnings.

## 4. How to run test?
```
./test.sh
```

## 5. To run the interpreter
```sh
./src/bin/pine.js hi.pine
```

Note that `hi.pine` is just a file name.


## 6. How to build C++ binding code?
```
cd src
npm install
```

## 7. How to publish this package?
```
./publish
```
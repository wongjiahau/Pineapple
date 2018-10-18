# Pineapple Language

## 1. How to install?

For Windows user, open command prompt in Administrator mode and enter the following command:

```sh
npm install -g pinelang
```

For Mac/Linux user, enter the following command:

```sh
sudo npm install -g pinelang
```

## 2. How to use?

### 2.1 Create a file named `hello.pine` with the following content.

```py
def .main
    "Hello world".show
```

### 2.2 Run the Pineapple interpreter

```sh
pine hello.pine
```

# How to get started (For developers)

## 1. Install dependencies

```
cd src
npm install
```

## 2. Generate the parser

```
./genparser.js
```

## 3. Run the typescript transipler 

```sh
./build.sh
```

To run the transpiler without watching file changes, and also TSLint check:

```sh
./build.sh 0
```

## 3.1 How to run TSLint

```sh
cd src/ts
tslint --project ./ --fix
```

The command above will run TSLint on the `src/ts` folder, and also fix any fixable warnings.

## 4. How to run test?

```sh
./test.sh
```

## 5. To run the interpreter

```sh
./src/bin/pine.js hi.pine
```

Note that `hi.pine` is just a file name.

## 6. How to build C++ binding code?

```sh
cd src
npm install
```

## 7. How to publish this package?

```sh
./publish
```

## 8. How to check for unused dependencies?

```sh
npm i -g depcheck
cd src
depcheck
```

## 9. How to package Pineapple's interpreter into a single executable binary?

```sh
node package.js
```
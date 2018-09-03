#!/bin/bash

# This script is to transpile the TypeScript source code to Javascript
if [ -d js ]; then
    echo "Removing js folder . . ."
    rm -rf js
fi

cd ts
# If passed in 0, don't launch watch mode
if [ "$1" -eq 0 ]; then
    echo "Running TSLint to check for bad code . . ."
    tslint --project .

    echo "Transpiling . . ."
    tsc
else
    echo "Transpiling in watch mode . . ."
    tsc --watch
fi
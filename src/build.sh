#!/bin/bash

# This script is to transpile the TypeScript source code to Javascript
if [ -d dist ]; then
    echo "Removing dist folder . . ."
    rm -rf dist
fi

cd ts
# If passed in 0, don't launch watch mode
if [ "$1" -eq 0 ]; then
    echo "Transpiling . . ."
    ../node_modules/typescript/bin/tsc
else
    echo "Transpiling in watch mode . . ."
    ../node_modules/typescript/bin/tsc --watch
fi
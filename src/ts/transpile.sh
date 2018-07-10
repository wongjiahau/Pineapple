#!/bin/bash
# This script is to transpile the TypeScript source code to Javascript
echo "Transpiling . . ."
cd ../js
rm **js
rm -rf ./tests
cd ../ts
tsc --watch
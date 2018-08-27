#!/bin/bash
# This script is to transpile the TypeScript source code to Javascript
echo "Transpiling . . ."

if [ -d ../js ]; then
    echo "Removing js folder"
    rm -rf ..js
fi

# If passed in 0, don't launch watch mode
if [ "$1" -eq 0 ]; then
    tsc
else
    tsc --watch
fi
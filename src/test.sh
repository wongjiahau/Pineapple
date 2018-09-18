#!/bin/bash

# This r option is needed for Travis CI
if [ "$1" = "0" ]; then
    ./node_modules/jest/bin/jest.js 
else
    ./node_modules/jest/bin/jest.js --watch
fi

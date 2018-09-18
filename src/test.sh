#!/bin/bash

# This 0 option is needed for Travis CI
if [ "$1" = "0" ]; then
    # Run test on compiled Javascripts, because using transformer is memory-expensive 
    ./node_modules/jest/bin/jest.js './dist/*' --ci
else
    # Run test on Typescript test files using transformer ts-jest
    ./node_modules/jest/bin/jest.js './ts/*' --watch 
fi

#!/bin/bash

# This 0 option is needed for Travis CI
if [ "$1" -eq 0 ]; then
    ./node_modules/jest/bin/jest.js --coverage
else
    ./node_modules/jest/bin/jest.js --watch
fi

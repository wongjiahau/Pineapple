#!/bin/bash

# This 0 option is needed for Travis CI
if [ "$1" = "0" ]; then
    ./node_modules/jest/bin/jest.js --ci
else
    ./node_modules/jest/bin/jest.js --watch
fi

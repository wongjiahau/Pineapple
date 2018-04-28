#!/bin/bash
echo "Transpiling . . ."
cd ../js
rm **js
rm -rf ./tests
cd ../ts
tsc --watch
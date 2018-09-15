#!/bin/bash
# This file will do:
#   1) Run code coverage using jest
#   2) Publish code coverage report to codecov.io


./node_modules/jest/bin/jest.js --coverage

./node_modules/codecov/bin/codecov -t ee77a6e3-944f-4327-b901-328bf9890675
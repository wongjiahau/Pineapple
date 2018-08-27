#!/bin/bash
# This script is to generate parser using jison

echo "Generating parser using jison . . ."
cd "./jison"
jison pineapple-parser-v2.jison
cd ..
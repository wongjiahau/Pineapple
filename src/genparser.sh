#!/bin/bash
# This script is to generate parser using jison

echo "Generating parser using jison . . ."
cd "./jison"
jison pineapple-parser-v2.jison

# The following line is a workaround
# This is to allow lexical error to have location details
# This line can be removed once the pull request is accepted
# Refer https://github.com/zaach/jison-lex/pull/24
sed -i '/Lexical/a loc: this.yylloc,' pineapple-parser-v2.js 

cd ..
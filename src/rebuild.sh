#!/bin/bash
# To re-generate the parser from grammar.js
rm binding.gyp
./node_modules/tree-sitter-cli/cli.js generate
node-gyp build
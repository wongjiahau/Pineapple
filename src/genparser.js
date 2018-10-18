#!/usr/bin/env node
// This script is to generate parser using jison
// It will watch for file changes of pineapple-parser-v3.jison

const fs = require("fs");
fs.watchFile('./jison/pineapple-parser-v3.jison', (curr, prev) => {
    run();
});

function run() {
    console.log(new Date());
    const { spawnSync } = require( 'child_process' );

    // Generate the parser file using jison
    console.log("Generating parser using jison . . .");
    const jison = spawnSync( './node_modules/jison/lib/cli.js', 
        [ './jison/pineapple-parser-v3.jison', '--outfile', './jison/pineapple-parser-v3.js' ] );

    console.log( `jison stderr:\n ${jison.stderr.toString()}` );
    console.log( `jison stdout:\n ${jison.stdout.toString()}` );

    /*
    # The following line is a workaround
    # This is to allow lexical error to have location details
    # This line can be removed once the pull request is accepted
    # Refer https://github.com/zaach/jison-lex/pull/24
    */
    const sed = spawnSync('sed', 
        ['-i', '/Lexical/a loc: this.yylloc,', './jison/pineapple-parser-v3.js']);

    console.log( `sed stderr:\n ${sed.stderr.toString()}` );
    console.log( `sed stdout:\n ${sed.stdout.toString()}` );

}

// Run once first before waiting file changes
run();
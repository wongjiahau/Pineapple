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
    
    const jison = spawnSync( 'node', // Need to call using node as shebang don't work in Windows, refer https://stackoverflow.com/questions/43419893/how-do-i-fix-error-spawn-unknown-with-node-js-v7-8-0-on-windows-10
        ['./node_modules/jison/lib/cli.js', './jison/pineapple-parser-v3.jison', '--outfile', './jison/pineapple-parser-v3.js' ]);
    
    logProcess(jison);

    /*
    # The following line is a workaround
    # This is to allow lexical error to have location details
    # This line can be removed once the pull request is accepted
    # Refer https://github.com/zaach/jison-lex/pull/24
    */
    const sed = spawnSync('sed', 
        ['-i', '/Lexical/a loc: this.yylloc,', './jison/pineapple-parser-v3.js']);

    logProcess(sed);

}

function logProcess(process) {
    console.log("Command: " + process.args.join(" "));
    if(process.error) {
        console.log(process.error);
    }
    if(process.stderr) {
        console.log("Error: " + process.stderr.toString());
    }
    if(process.stdout) {
        console.log("OK: " + process.stdout.toString());
    }
    console.log("\n");
}

// Run once first before waiting file changes
run();

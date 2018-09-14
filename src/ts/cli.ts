import { renderError } from "./errorType/renderError";
import { isFail } from "./fillUpTypeInformation";
import { interpret, loadFile } from "./interpret";

const fs = require("fs");
const vm = require("vm");
const VERSION = require("../package.json").version;
const program = require("commander");

program
    .version(VERSION)
    .option("-l, --log", "Log output")
    .parse(process.argv);

if (program.log) {
    console.log("Logging");
}

if (program.args.length === 0) {
    console.log(`Pineapple ${VERSION}`);
}

program.args.forEach((arg: string) => {
    if (fs.existsSync(arg)) {
        const file = loadFile(fs.realpathSync(arg));
        if (file === null) {
            throw new Error(`Cannot open file ${arg}`);
        }
        const result = interpret(file, execute, true);
        if (isFail(result)) {
            console.log(renderError(result.error));
        }
    } else {
        console.log(`Cannot open file '${arg}'.`);
    }
});

function execute(javascriptCode: string): string {
    // use strict is added to improve performance
    // See https://github.com/petkaantonov/bluebird/wiki/Optimization-killers
    let code = `"use strict";`;

    // This step is necessary because `require` is not defined, so we need to pass in the context
    // Refer https://nodejs.org/api/vm.html#vm_example_running_an_http_server_within_a_vm
    code += `((require) => {
        ${javascriptCode}
        if(typeof _main_ === 'function') {
            _main_();
        }
    })`;

    return vm.runInThisContext(code)(require);
}

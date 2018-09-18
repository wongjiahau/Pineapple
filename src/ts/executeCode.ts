import { IntermediateRepresentation } from "./getIntermediateRepresentation";
const vm = require("vm");

export function executeCode(javascriptCode: string, ir?: IntermediateRepresentation): string {
    let functionTable = "";
    if(ir) {
        functionTable = JSON.stringify(ir.symbolTable.funcTab);
    }
    // use strict is added to improve performance
    // See https://github.com/petkaantonov/bluebird/wiki/Optimization-killers
    let code = `"use strict";`;

    // This step is necessary because `require` is not defined, so we need to pass in the context
    // Refer https://nodejs.org/api/vm.html#vm_example_running_an_http_server_within_a_vm
    code += `((require) => {
        ${javascriptCode}

        function $$ensure$$(bool) {
            if(!bool) {
                const e = new Error();
                e.name = "Ensurance Failed";
                throw e;
            }
        }

        function $$pass$$() {
            const e = new Error();
            e.name = "Not implemented error";
            throw e;
        }

        // run if ().main function exist
        if(typeof _main_ === 'function') {
            try {
                _main_();
            } catch (error) {
                return error;
            }
        }
    })`;

    return vm.runInThisContext(code)(require);
}
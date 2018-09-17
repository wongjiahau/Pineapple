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
        const functab = ${functionTable};

        ${javascriptCode}

        // run if ().main function exist
        if(typeof _main_ === 'function') {
            try {
                _main_();
            } catch (error) {
                const errorStack = error.stack.split("\\n");
                const mappedStack = [];

                // start from 1, because 0th is the error message
                for(let i = 1; i < errorStack.length; i++) {
                    const callingFunc = errorStack[i].trim().split(" ")[1];
                    if(callingFunc === "_main_") {
                        break;
                    } else {
                        // mappedStack.push(functab[callingFunc]);
                    }
                }
                return mappedStack;
            }
        }
    })`;

    return vm.runInThisContext(code)(require);
}
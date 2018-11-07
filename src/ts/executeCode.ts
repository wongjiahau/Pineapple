import { IntermediateRepresentation } from "./getIntermediateRepresentation";
import { InterpreterOptions } from "./interpret";
const vm = require("vm");

export function executeCode(
    javascriptCode: string,
    interceptor: Interceptor,
    options: InterpreterOptions,
    ir?: IntermediateRepresentation
): string {
    let functionTable = "";
    if (ir) {
        functionTable = JSON.stringify(ir.symbolTable.funcTab);
    }
    // use strict is added to improve performance
    // See https://github.com/petkaantonov/bluebird/wiki/Optimization-killers
    let code = `"use strict";`;

    // This step is necessary because `require` is not defined, so we need to pass in the context
    // Refer https://nodejs.org/api/vm.html#vm_example_running_an_http_server_within_a_vm
    code += `((require,$$interceptor$$) => { const $$examples$$ = []; /*this is need to store tests*/ const $$GROUP$$={};
        ${javascriptCode}
        _Main_(); // Call the main function
        $$interceptor$$.done();

        function $$typeof$$(x) {
            switch(typeof x) {
                case "number": return "Number";
                case "string": return "String";
                case "object": return x.$kind; // this is injected by transpile.ts
            }
        }

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

        function $$runExamples$$() {
            // $$examples$$ is populated by tranpsile.ts
            for(let i = 0; i < $$examples$$.length; i ++) {
                $$examples$$[i]();
            }
        }

        function $$handleExample$$(left, right, file, location) {
            const where = file + " at line " + location.first_line;
            if(left === right) {
                console.log("Example ok at " + where);
            } else {
                console.log("Example failed at " + where);
            }
        }

        try {
            switch("${options.run}") {
                case "Program":
                    // run if ().main function exist
                    if(typeof _Main_ === 'function') {
                        _Main_();
                    }
                    break;
                case "RunExample":
                    $$runExamples$$();
                    break;
            }
        } catch (error) {
            console.log(error)
            return error;
        }
    })`;

    return vm.runInThisContext(code)(require, interceptor);
}

export interface Interceptor {
    log(x: any): void;
    done(): void;
}

export class InterceptorForTesting implements Interceptor {
    private output: string = "";
    private whenDone: (collectedOutput: string) => void;
    public constructor(whenDone: (collectedOutput: string) => void) {
        this.whenDone = whenDone;
    }

    public log(x: any): void {
        this.output += x.toString() + " ";
    }

    public done(): void {
        this.whenDone(this.output);
    }
}

export class InterceptorThatDoNothing implements Interceptor {
    public log(x: any): void {
        console.log(x.toString());
    }

    public done(): void {
        // do nothing
    }
}

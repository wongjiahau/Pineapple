import { getIntermediateForm, IntermediateForm } from "./getIntermediateForm";
import { SourceCode } from "./pineRepl";
import { transpile } from "./transpile";
import { initTypeTree } from "./typeTree";

/**
 * WARNING: The `pine2js` function is meant for unit testing only
 */
export function pine2js(input: string, filename: string= ""): string {
    const source: SourceCode = {
            filename: filename,
            content: input
    };
    const initForm: IntermediateForm = {
        funcTab: {},
        typeTree: initTypeTree(),
        syntaxTrees: []
    };
    const intermediateForm = getIntermediateForm(source, initForm);
    return transpile(intermediateForm.syntaxTrees);
}

export function prettyPrint(ast: any, removeLocation: boolean): void {
    if (removeLocation) {
        ast = removeTokenLocation(ast);
    }
    console.log(JSON.stringify(ast, null, 2));
}

function removeTokenLocation(ast: any): any {
    for (const key in ast) {
        if (key === "location") {
            delete ast[key];
        } else if (typeof(ast[key]) === "object") {
            ast[key] = removeTokenLocation(ast[key]);
        }
    }
    return ast;
}

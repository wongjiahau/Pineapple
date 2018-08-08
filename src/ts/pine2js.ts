import { getIntermediateForm, initialIntermediateForm, IntermediateForm } from "./getIntermediateForm";
import { SourceCode } from "./interpreter";
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
    const intermediateForm = getIntermediateForm(source, initialIntermediateForm());
    let result = "";
    for (const key in intermediateForm.symbolTable.funcTab) {
        if (intermediateForm.symbolTable.funcTab.hasOwnProperty(key)) {
            result += transpile(intermediateForm.symbolTable.funcTab[key]);
        }
    }
    return result;
    // let source = transpile(intermediateForm.syntaxTrees);
    // source += transpile(intermediateForm.funcTab)
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

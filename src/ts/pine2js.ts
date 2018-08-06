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
    for (const key in intermediateForm.funcTab) {
        if (intermediateForm.funcTab.hasOwnProperty(key)) {
            result += transpile(intermediateForm.funcTab[key]);
        }
    }
    return result;
    // let source = transpile(intermediateForm.syntaxTrees);
    // source += transpile(intermediateForm.funcTab)
}

export function prettyPrint(tree: any, removeLocation: boolean): void {
    if (removeLocation) {
        tree = removeProperty(tree, "location");
    }
    console.log(JSON.stringify(tree, null, 2));
}

export function removeProperty(ast: any, propertyName: string): any {
    for (const key in ast) {
        if (key === propertyName) {
            delete ast[key];
        } else if (typeof(ast[key]) === "object") {
            ast[key] = removeProperty(ast[key], propertyName);
        }
    }
    return ast;
}

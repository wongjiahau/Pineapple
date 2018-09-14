import { getIntermediateForm, initialIntermediateForm } from "./getIntermediateForm";
import { transpile } from "./transpile";
import { parseCodeToSyntaxTree } from "./parseCodeToSyntaxTree";
import { SourceCode } from "./interpret";
import { isFail } from "./fillUpTypeInformation";

/**
 * OBSOLETED: Should be deleted soon
 * WARNING: The `pine2js` function is meant for unit testing only
 */
export function pine2js(input: string, filename: string= "STDIN"): string {
    const source: SourceCode = {
            filename: filename,
            content: input
    };
    const parseResult = parseCodeToSyntaxTree(source);
    if(isFail(parseResult)) return parseResult;
    const ast = parseResult.value;

    const processResult= getIntermediateForm(ast, initialIntermediateForm());
    if(isFail(processResult)) return processResult;
    const intermediateForm = processResult.value;
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

export function prettyPrint(ast: any, removeLocation: boolean = true): void {
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

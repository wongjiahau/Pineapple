// import { getFunctionTable } from "./getFunctionTable";
import { Declaration, TokenLocation } from "./ast";
import { PineError, RawError } from "./errorType";
import { fillUpTypeInformation } from "./fillUpTypeInformation";
import { generateErrorMessage } from "./generateErrorMessage";
import { preprocess } from "./preprocess";
import { tpDeclaration } from "./transpile";
import { initTypeTree } from "./typeTree";
const parser     = require("../jison/pineapple-parser-v2");

/**
 * WARNING: The `pine2js` function is meant for testing only
 */
export function pine2js(input: string, filename: string= ""): string {
    const result = preprocess(input);
    try {
        const syntaxTree = parser.parse(result);
        const [newSyntaxTree, funcTab , typeTree ]
            = fillUpTypeInformation(syntaxTree, {}, initTypeTree());
        // prettyPrint(ast, true);
        return tpDeclaration(newSyntaxTree);
    } catch (error) {
        console.log(error);
        const x = (error as PineError);
        x.errorMessage = generateErrorMessage(input, x.rawError, filename);
        throw error;
    }
}

export function prettyPrint(ast: Declaration, removeLocation: boolean): void {
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

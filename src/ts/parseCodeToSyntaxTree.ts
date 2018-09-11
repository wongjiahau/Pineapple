import { SourceCode } from "./cli";
import { Declaration, SyntaxTree, Expression } from "./ast";
import { preprocess } from "./preprocess";
import { raise } from "./fillUpTypeInformation";
import { ErrorSyntax } from "./errorType/E0010-Syntax";
import { ErrorLexical } from "./errorType/E0028-Lexical";

export function parseCodeToSyntaxTree(sourceCode: SourceCode): SyntaxTree {
    sourceCode.content = preprocess(sourceCode);
    return {
        source: sourceCode,
        declarations: parseCode(sourceCode) as Declaration[],
        importedFiles: {}
    };
}

/**
 *
 *
 * @export
 * @param {SourceCode} sourceCode
 * @param {SourceCode} originalSourceCode This param is only needed for string interpolation
 * @returns {(Declaration[] | Expression)}
 */
export function parseCode(sourceCode: SourceCode, originalSourceCode?: SourceCode): Declaration[] | Expression {
    const parser     = require("../jison/pineapple-parser-v2");
    try {
        return parser.parse(sourceCode.content);
    } catch(error) {
        if(originalSourceCode) {
            sourceCode = originalSourceCode;
        }
        if (isSyntaxError(error)) {
            // this part is needed to inject the sourceCode
            raise(ErrorSyntax(error.hash), sourceCode);
        } else if (isLexError(error)) {
            raise(ErrorLexical(error), sourceCode);
        }
        throw error; // Will be caught by interpreter.ts
    }
}

export function isSyntaxError(error: any) {
    return error.hash !== undefined && error.hash.token !== null;
}

export function isLexError(error: any) {
    return error.hash !== undefined && error.hash.token === null;
}
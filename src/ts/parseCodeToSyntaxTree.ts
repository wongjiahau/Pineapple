import { Declaration, SyntaxTree, Expression, NullTokenLocation } from "./ast";
import { preprocess } from "./preprocess";
import { Maybe, fail, ok, isOK } from "./fillUpTypeInformation";
import { ErrorSyntax } from "./errorType/E0010-Syntax";
import { ErrorLexical } from "./errorType/E0028-Lexical";
import { SourceCode } from "./interpret";
import { ErrorDetail } from "./errorType/errorUtil";

export function parseCodeToSyntaxTree(sourceCode: SourceCode)
: Maybe<SyntaxTree, ErrorDetail> {
    sourceCode.content = preprocess(sourceCode);
    const parsedCode = parseCode(sourceCode);
    if(isOK(parsedCode)) {
        return ok({
            source: sourceCode,
            declarations: parsedCode.value as Declaration[],
            importedFiles: {}
        });
    } else {
        return parsedCode;
    }
}

/**
 *
 *
 * @export
 * @param {SourceCode} preprocessedSourceCode
 * @param {SourceCode} originalSourceCode This param is only needed for string interpolation
 * @returns {(Declaration[] | Expression)}
 */
export function parseCode(
    preprocessedSourceCode: SourceCode, 
    originalSourceCode?: SourceCode
): Maybe<Declaration[] | Expression, ErrorDetail> {
    const parser     = require("../jison/pineapple-parser-v2");
    try {
        return ok(parser.parse(preprocessedSourceCode.content));
    } catch(error) {
        if(originalSourceCode) {
            preprocessedSourceCode = originalSourceCode;
        }
        if (isSyntaxError(error)) {
            // this part is needed to inject the sourceCode
            const syntaxError = ErrorSyntax(error.hash);
            syntaxError.source = preprocessedSourceCode;
            return fail(syntaxError);
        } else if (isLexError(error)) {
            const lexError = ErrorLexical(error);
            lexError.source = preprocessedSourceCode;
            return fail(lexError);
        } else {
            return fail(UnkwownError(""));
        }
    }
}

export function UnkwownError(message: string): ErrorDetail {
    return {
        code: "-999",
        name: "UnknownError",
        message: message,
        relatedLocation: NullTokenLocation()
    };
}

export function isSyntaxError(error: any) {
    return error.hash !== undefined && error.hash.token !== null;
}

export function isLexError(error: any) {
    return error.hash !== undefined && error.hash.token === null;
}
import { Declaration, Expression, NullTokenLocation, SyntaxTree } from "./ast";
import { ErrorSyntax } from "./errorType/E0010-Syntax";
import { ErrorLexical } from "./errorType/E0028-Lexical";
import { ErrorDetail } from "./errorType/ErrorDetail";
import { fail, isFail, isOK, Maybe, ok } from "./maybeMonad";
import { SourceCode } from "./interpret";
import { preprocess } from "./preprocess";

export function parseCodeToSyntaxTree(sourceCode: SourceCode)
: Maybe<SyntaxTree, ErrorDetail> {
    const preprocessResult = preprocess(sourceCode);
    if (isFail(preprocessResult)) { return preprocessResult; }
    sourceCode.content = preprocessResult.value;

    const parseResult = parseCode(sourceCode);
    if (isOK(parseResult)) {
        return ok({
            source: sourceCode,
            declarations: parseResult.value as Declaration[],
            importedFiles: {}
        });
    } else {
        return parseResult;
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
    const parser     = require("../jison/pineapple-parser-v3");
    try {
        return ok(parser.parse(preprocessedSourceCode.content));
    } catch (error) {
        if (originalSourceCode) {
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
            console.log(error);
            return fail(UnkwownError(error.message));
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

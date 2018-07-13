import { AtomicToken, FunctionCall, FunctionDeclaration, TokenLocation } from "./ast";
import { ErrorNoConformingFunction, RawError } from "./errorType";
import { labelLineNumbers } from "./labelLineNumbers";
import { stringifyType } from "./transpile";

export interface ErrorMessage {
    message: string;
    location: TokenLocation;
    filename: string;
    relatedSourceCode: string;
    errorCode: string;
}

export function generateErrorMessage(
    sourceCode: string,
    error: RawError,
    filename: string
): ErrorMessage {
    // tslint:disable-next-line:one-variable-per-declaration
    const [message, location] = getMessage(error);
    return {
        message: message,
        relatedSourceCode: sourceCode,
        location: location,
        filename: filename,
        errorCode: getErrorCode(error)
    };
}

export function getMessage(error: RawError): [string, TokenLocation] {
    let message: string = "";
    let tokenLocation: TokenLocation | null = null;
    switch (error.kind) {
        case "ErrorVariableRedeclare":
            message = "" +
`You cannot declare variable '${error.initialVariable.repr}' again, ` +
`because it is already declared at line ${error.initialVariable.location.first_line}.`;
            tokenLocation = error.newVariable.location;
            break;

        case "ErrorUsingUnknownFunction":
            message = "" +
`You cannot call the function '${getFuncSignature(error.func.signature)}' as it does not exist.`;
            tokenLocation = error.func.location;
            break;

        case "ErrorNoConformingFunction":
            message = renderNoConfirmingFunctionMessage(error);
            tokenLocation = error.func.location;
    }
    if (tokenLocation === null)  {
        throw new Error("Token location shouldn't be null");
    }
    return [message, tokenLocation];

}

function renderNoConfirmingFunctionMessage(e: ErrorNoConformingFunction): string {
        const funcSignature = getFuncSignature(e.func.signature);
        return "\n" +
`I cannot find any \`${funcSignature}\` function that ` +
`has the signature of \`${getFullFuncSignature(e.func)}\`.
However, I found the following:

    ${e.matchingFunctions.map((x) => getFullFuncSignature(x))}`;
}

export function getFuncSignature(sigs: AtomicToken[]): string {
    return sigs.map((x) => x.repr).join("");
}

export function getErrorCode(error: RawError): string {
    const code: string = (() => {
        switch (error.kind) {
            case "ErrorVariableRedeclare":      return "VARE";
            case "ErrorUsingUnknownFunction":   return "USUF";
            case "ErrorNoConformingFunction":   return "NOCF";
    }})();

    return "For more information, Google search PINER_" + code + ".";
}

export function getLocation(location: TokenLocation): string {
    return `line ${location.first_line}, column ${location.first_column}`;
}

export function getFullFuncSignature(f: FunctionCall | FunctionDeclaration): string {
    switch (f.kind) {
    case "FunctionCall":
        switch (f.parameters.length) {
        case 1:
        return `${f.signature[0].repr} ${stringifyType(f.parameters[0].returnType)}`;
        }
        break;
    case "FunctionDeclaration":
        switch (f.parameters.length) {
        case 1:
        return `${f.signature[0].repr} ${stringifyType(f.parameters[0].typeExpected)}`;
        }
        break;
    }
}

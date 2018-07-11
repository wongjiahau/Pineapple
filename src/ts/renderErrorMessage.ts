import { AtomicToken, TokenLocation } from "./ast";
import { ErrorObject } from "./errorType";
import { labelLineNumbers } from "./labelLineNumbers";

export function renderErrorMessage(sourceCode: string, error: ErrorObject): string {
    // tslint:disable-next-line:one-variable-per-declaration
    const [message, location] = getMessage(error);
    let result = "\nERROR >>> " + message;
    result += "\n\n" + (labelLineNumbers(sourceCode, location.first_line));
    result += `\nThe error is located at ${getLocation(location)}.`;
    result += "\n\n" + getErrorCode(error);
    return result;
}

export function getMessage(error: ErrorObject): [string, TokenLocation] {
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
    }
    if (tokenLocation === null)  {
        throw new Error("Token location shouldn't be null");
    }
    return [message, tokenLocation];

}

function getFuncSignature(sigs: AtomicToken[]): string {
    return sigs.map((x) => x.repr).join("");
}

export function getErrorCode(error: ErrorObject): string {
    const code: string = (() => {
        switch (error.kind) {
            case "ErrorVariableRedeclare":      return "VARE";
            case "ErrorUsingUnknownFunction":   return "USUF";
        }
    })();

    return "For more information, Google search PINER_" + code + ".";
}

export function getLocation(location: TokenLocation): string {
    return `line ${location.first_line}, column ${location.first_column}`;
}

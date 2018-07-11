import { TokenLocation } from "./ast";
import { ErrorObject } from "./errorType";
import { labelLineNumbers } from "./labelLineNumbers";

export function renderErrorMessage(sourceCode: string, error: ErrorObject): string {
    switch (error.kind) {
        case "ErrorVariableRedeclare":
            let result = "";
            result += "" +
`\nERROR >>> You cannot declare variable '${error.initialVariable.repr}' again,` +
`because it is already declared at line ${error.initialVariable.location.first_line}.`;
            result += "\n\n" + (labelLineNumbers(sourceCode, error.newVariable.location.first_line));
            result += `\nThe error is located at ${getLocation(error.newVariable.location)}.`;
            result += "\n\n" + getErrorCode(error);
            return result;
    }
}

export function getErrorCode(error: ErrorObject): string {
    const code: string = (() => {
        switch (error.kind) {
            case "ErrorVariableRedeclare": return "VARE";
        }
    })();

    return "For more information, Google search PINER_" + code + ".";
}

export function getLocation(location: TokenLocation): string {
    return `line ${location.first_line}, column ${location.first_column}`;
}

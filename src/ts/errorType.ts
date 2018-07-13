import {
    FunctionCall,
    FunctionDeclaration,
    Variable
} from "./ast";
import { ErrorMessage } from "./generateErrorMessage";

export class PineError extends Error {
    public rawError     !: RawError;
    public errorMessage !: ErrorMessage;
}

export type RawError
    = ErrorVariableRedeclare
    | ErrorUsingUnknownFunction
    | ErrorNoConformingFunction
    ;

export interface ErrorVariableRedeclare {
    kind: "ErrorVariableRedeclare";
    initialVariable: Variable;
    newVariable: Variable;
}

export interface ErrorUsingUnknownFunction {
    kind: "ErrorUsingUnknownFunction";
    func: FunctionCall;
}

export interface ErrorNoConformingFunction {
    kind: "ErrorNoConformingFunction";
    func: FunctionCall;
    matchingFunctions: FunctionDeclaration[];
}

import {
    FunctionCall,
    Variable
} from "./ast";

export type ErrorObject
    = ErrorVariableRedeclare
    | ErrorUsingUnknownFunction
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

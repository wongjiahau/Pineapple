import { Variable } from "./ast";

export type ErrorObject = ErrorVariableRedeclare;

export interface ErrorVariableRedeclare {
    kind: "ErrorVariableRedeclare";
    initialVariable: Variable;
    newVariable: Variable;
}

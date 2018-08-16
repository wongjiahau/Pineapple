import { Expression } from "../ast";
import { ErrorDetail } from "./errorUtil";

export function ErrorAssigningVoidToVariable(
    expr: Expression
): ErrorDetail {
    return {
        code: "0021",
        name: "ErrorAssigningVoidToVariable",
        message:
`The given expression does not return any value, so you cannot assign it to a variable.`,
        relatedLocation: expr.location
    };
}

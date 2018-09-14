import { Expression } from "../ast";
import { stringifyTypeReadable } from "./errorUtil";
import { ErrorDetail } from "./ErrorDetail";

export function ErrorInterpolatedExpressionIsNotString(
    e: Expression
): ErrorDetail {
    return {
        code: "0026",
        name: "ErrorInterpolatedExpressionIsNotString",
        message:
`The given expression should have type of

    String

But it has type of

    ${stringifyTypeReadable(e.returnType)}`,
        relatedLocation: e.location,
        hint:
`Every interpolated expression must have type of String.

You can try calling the .toString function on it.

For example:

    myExpression.toString
`
    };
}

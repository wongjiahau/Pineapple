import { Expression } from "../ast";
import { stringifyTypeReadable } from "./errorUtil";
import { ErrorDetail } from "./ErrorDetail";

export function ErrorNonVoidExprNotAssignedToVariable(
    e: Expression,
): ErrorDetail {
    return {
        code: "E0016",
        name: "ErrorNonVoidExprNotAssignedToVariable",
        message:
`
The given expression have type of:

    ${stringifyTypeReadable(e.returnType)}

But not:

    Void

So, you should assign it to a variable.`,
        relatedLocation: e.location
    };
}

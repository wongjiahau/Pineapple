import { Expression } from "../ast";
import { stringifyTypeReadable } from "./errorUtil";
import { ErrorDetail } from "./ErrorDetail";

export function ErrorConditionIsNotBoolean(
    e: Expression
): ErrorDetail {
    return {
        code: "0012",
        name: "ErrorConditionIsNotBoolean",
        message:
`If/Elif's condition should have type of

    Boolean

But the given expression have type of

    ${stringifyTypeReadable(e.returnType)}`,
        relatedLocation: e.location
    };
}

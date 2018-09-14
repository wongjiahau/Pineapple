import { Expression } from "../ast";
import { stringifyTypeReadable } from "./errorUtil";
import { ErrorDetail } from "./ErrorDetail";

export function ErrorForExprNotArray(
    e: Expression
): ErrorDetail {
    return {
        code: "E0019",
        name: "ErrorForExprNotArray",
        message:
`The expression of \`for\` statement should have type of:

    List

But the give expression have type of:

    ${stringifyTypeReadable(e.returnType)}
`,
        relatedLocation: e.location
    };
}

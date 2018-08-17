import { Expression, VariableDeclaration } from "../ast";
import { ErrorDetail, stringifyTypeReadable } from "./errorUtil";

export function ErrorAssigningNullToUnnullableVariable(
    v: VariableDeclaration,
    e: Expression
): ErrorDetail {
    return {
        code: "0022",
        name: "ErrorAssigningNullToUnnullableVariable",
        message: `You cannot assign \`nil to variable ${v.variable.repr} because it is not nullable.`,
        hint:
`To make a variable nullable, you have to mark the expected type with question mark (?).

For example:

    let ${v.variable.repr} ${stringifyTypeReadable(v.typeExpected)}? = \`nil
    `,
        relatedLocation: e.location
    };
}

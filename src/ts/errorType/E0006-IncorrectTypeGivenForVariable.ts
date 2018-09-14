import { Expression, TypeExpression, Variable } from "../ast";
import { stringifyTypeReadable } from "./errorUtil";
import { ErrorDetail } from "./ErrorDetail";

export function ErrorIncorrectTypeGivenForVariable(
    relatedVariable: Variable,
    expectedType: TypeExpression,
    relatedExpression: Expression,
): ErrorDetail {
    return {
        code: "0006",
        name: "ErrorIncorrectTypeGivenForVariable",
        message:
`

The variable \`${relatedVariable.repr}\` should have the type of:

    ${stringifyTypeReadable(expectedType)}

But the expression you provided have the type of:

    ${stringifyTypeReadable(relatedExpression.returnType)}
    `,
        relatedLocation: relatedExpression.location
    };
}
